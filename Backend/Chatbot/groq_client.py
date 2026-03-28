from groq import Groq
import os
from dotenv import load_dotenv

# Load env
load_dotenv()

client = Groq(
    api_key=''  # ✅ best practice
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Explain the importance of peace between nations? "
        }
    ],
    model="llama-3.1-8b-instant",
)

print(chat_completion.choices[0].message.content)
