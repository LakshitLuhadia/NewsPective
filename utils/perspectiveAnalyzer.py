from huggingface_hub import InferenceClient
import json
import sys
import os

def get_alternative_perspective(article_text, perspective_type):
    perspective_prompts = {
        "student": "from a student's viewpoint, considering academic implications and youth perspective",
        "researcher": "from a researcher's analytical viewpoint, focusing on methodology and evidence",
        "expert": "from an expert's professional viewpoint, considering industry implications",
        "general": "from a general adult's everyday perspective, focusing on practical implications",
    }

    prompt = f"""
    If the input is in French, The meaningful output should also be in French. Do NOT translate. Analyze this news article and provide an alternative perspective {perspective_prompts[perspective_type]}:
    {article_text}
    
    Rules:
    1. Don't change the facts of the story
    2. Present a different but valid viewpoint on the same events
    3. Be objective and balanced
    4. If there's no meaningful alternative perspective, return "No alternative perspective available". Do not just make up alternatives senselessly
    5. Perspective refers to how the user will interpret the news
    
    Provide the alternative perspective in a concise paragraph. Avoid any artificial language. 
    """

    client = InferenceClient(token=os.getenv("HUGGINGFACE_API_KEY"))

    try:
        response = client.text_generation(
            prompt,
            model="mistralai/Mistral-7B-Instruct-v0.3",
            max_new_tokens=250,
            temperature=0.7,
        )
        return {"alternative": response.strip() if response.strip() else None}
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        return {"alternative": None}


if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    result = get_alternative_perspective(
        f"{input_data['title']} {input_data['description']}",
        input_data.get("perspectiveType", "general"),
    )
    print(json.dumps(result))
