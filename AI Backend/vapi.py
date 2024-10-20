from flask import Flask, request, jsonify
from vapi_python import Vapi

app = Flask(__name__)
vapi = Vapi(api_key='3661f60f-c3ea-4dfd-acf5-f4d302258e7a')

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

@app.route('/api/start-voicebot', methods=['POST'])
def start_voicebot():
    vapi.start(assistant=assistant)
    return jsonify({"message": "Voicebot started"}), 200

@app.route('/api/stop-voicebot', methods=['POST'])
def stop_voicebot():
    vapi.stop()
    return jsonify({"message": "Voicebot stopped"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)