import chromadb
from chromadb.utils import embedding_functions
import requests
import xml.etree.ElementTree as ET
from urllib.parse import urlencode, quote_plus
from datetime import datetime

# Initialize Chroma client
chroma_client = chromadb.Client()

# Use OpenAI's embedding function (ensure you have an API key for this)
# Replace 'YOUR_OPENAI_API_KEY' with your actual API key
embedding_function = embedding_functions.OpenAIEmbeddingFunction(
    api_key='OPENAI_API_KEY',
    model_name="text-embedding-ada-002"
)

# Create or get collections for before and after papers
before_collection = chroma_client.get_or_create_collection(name="before_papers", embedding_function=embedding_function)
after_collection = chroma_client.get_or_create_collection(name="after_papers", embedding_function=embedding_function)

def search_arxiv_paper(title):
    base_url = 'http://export.arxiv.org/api/query?'
    query = 'search_query=ti:"{}"&max_results=1'.format(title)
    url = base_url + query
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error fetching paper: {response.status_code} - {response.text}")
        return None
    # Parse the XML response
    root = ET.fromstring(response.content)
    entries = root.findall('{http://www.w3.org/2005/Atom}entry')
    if entries:
        return entries[0]
    else:
        print("Paper not found.")
        return None

def get_paper_metadata(entry):
    paper = {}
    paper['id'] = entry.find('{http://www.w3.org/2005/Atom}id').text
    paper['title'] = entry.find('{http://www.w3.org/2005/Atom}title').text.strip()
    paper['summary'] = entry.find('{http://www.w3.org/2005/Atom}summary').text.strip()
    paper['authors'] = [author.find('{http://www.w3.org/2005/Atom}name').text for author in entry.findall('{http://www.w3.org/2005/Atom}author')]
    paper['categories'] = [category.attrib['term'] for category in entry.findall('{http://www.w3.org/2005/Atom}category')]
    paper['published'] = entry.find('{http://www.w3.org/2005/Atom}published').text
    return paper

def search_similar_papers(paper, when='before', max_results=50):
    base_url = 'http://export.arxiv.org/api/query?'
    # Use the primary categories and keywords from the title
    categories = ' OR '.join(['cat:' + cat for cat in paper['categories']])
    title_keywords = ' '.join(quote_plus(word) for word in paper['title'].split() if len(word) > 3)
    # Date filter
    published_date = paper['published'][:10]  # Extract date in YYYY-MM-DD
    if when == 'before':
        date_from = '1990-01-01'
        date_to = published_date
    elif when == 'after':
        date_from = published_date
        date_to = datetime.now().strftime('%Y-%m-%d')
    else:
        date_from = '1990-01-01'
        date_to = datetime.now().strftime('%Y-%m-%d')
    date_filter = f'submittedDate:[{date_from} TO {date_to}]'
    search_query = f'({categories}) AND ({title_keywords}) AND {date_filter}'
    query = urlencode({'search_query': search_query, 'start': 0, 'max_results': max_results})
    url = base_url + query
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error fetching similar papers ({when}): {response.status_code} - {response.text}")
        return []
    # Parse the XML response
    root = ET.fromstring(response.content)
    entries = root.findall('{http://www.w3.org/2005/Atom}entry')
    # Exclude the main paper if it's in the results
    similar_entries = [entry for entry in entries if entry.find('{http://www.w3.org/2005/Atom}id').text != paper['id']]
    return similar_entries

def main():
    # Get user input
    title = input("Enter the title of the research paper: ").strip()

    # Search for the paper
    entry = search_arxiv_paper(title)
    if not entry:
        return

    main_paper = get_paper_metadata(entry)
    print(f"\nMain paper: {main_paper['title']}")
    print(f"Published on: {main_paper['published'][:10]}")

    # Search for similar papers published before the main paper
    before_entries = search_similar_papers(main_paper, when='before', max_results=50)
    print(f"\nFound {len(before_entries)} similar papers published before the main paper.")
    before_papers = [get_paper_metadata(entry) for entry in before_entries]

    # Search for similar papers published after the main paper
    after_entries = search_similar_papers(main_paper, when='after', max_results=50)
    print(f"\nFound {len(after_entries)} similar papers published after the main paper.")
    after_papers = [get_paper_metadata(entry) for entry in after_entries]

    # Add all before papers to their collection
    before_docs = [paper['title'] + ': ' + paper['summary'] for paper in before_papers]
    before_ids = [paper['id'] for paper in before_papers]
    before_metadatas = [{
        'id': paper['id'],
        'title': paper.get('title', ''),
        'authors': ', '.join(paper.get('authors', [])),
        'published': paper.get('published', '')[:10]
    } for paper in before_papers]
    before_collection.add(documents=before_docs, metadatas=before_metadatas, ids=before_ids)

    # Add all after papers to their collection
    after_docs = [paper['title'] + ': ' + paper['summary'] for paper in after_papers]
    after_ids = [paper['id'] for paper in after_papers]
    after_metadatas = [{
        'id': paper['id'],
        'title': paper.get('title', ''),
        'authors': ', '.join(paper.get('authors', [])),
        'published': paper.get('published', '')[:10]
    } for paper in after_papers]
    after_collection.add(documents=after_docs, metadatas=after_metadatas, ids=after_ids)

    print("\nPapers added to Chroma collections for future queries.")

    # Query the 'before' papers
    print("\nSearching for top 3 similar papers from the 'before' set:")
    query_text = main_paper['title'] + ' ' + main_paper['summary']
    results_before = before_collection.query(
        query_texts=[query_text],
        n_results=3
    )
    print("\nTop 3 similar papers from 'before' set:")
    for doc, meta in zip(results_before['documents'][0], results_before['metadatas'][0]):
        print(f"- {meta['title']} (Published on: {meta.get('published', '')})")

    # Query the 'after' papers
    print("\nSearching for top 3 similar papers from the 'after' set:")
    results_after = after_collection.query(
        query_texts=[query_text],
        n_results=3
    )
    print("\nTop 3 similar papers from 'after' set:")
    for doc, meta in zip(results_after['documents'][0], results_after['metadatas'][0]):
        print(f"- {meta['title']} (Published on: {meta.get('published', '')})")

if __name__ == "__main__":
    main()
