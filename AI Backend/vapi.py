from vapi_python import Vapi

vapi = Vapi(api_key='VAPI_API_KEY')

assistant = {
  'firstMessage': 'Would you like to start?',
  'context': 'You are an AI assistant that explains research papers concisely and in a easy to understand way. Your task is to provide clear and concise explanations at a high level of academic papers the user is interested in as if you were explaining the paper to an elementary school student with no prior knowledge of the topics.',
  'model': {
    'provider': 'groq',
    'model': 'llama-3.1-405b-reasoning',
    'knowledgeBase': {
      "provider": "canonical",
      "fileIds": ["8c4d6d2d-6cbd-4ca7-a54b-56791cffba7f"]
    },
  },
  'voice': {
    'provider': 'cartesia',
    'voiceId': '638efaaa-4d0c-442e-b701-3fae16aad012'
  },
  'interruptionsEnabled': False,
  'recordingEnabled': True,
  'endCallMessage': 'Thank you'
}

vapi.start(assistant=assistant)