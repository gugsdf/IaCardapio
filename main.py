from flask import Flask, request, jsonify, render_template, send_from_directory
from dotenv import load_dotenv
import os
import google.generativeai as genai

# Carrega variáveis do .env
load_dotenv()

# Configura API Gemini
api_key = os.getenv("API_KEY")
if not api_key:
    raise RuntimeError("Coloque sua GEMINI_API_KEY no arquivo .env antes de rodar!")

genai.configure(api_key=api_key)

# Modelo Gemini
llm = genai.GenerativeModel(model_name="gemini-2.5-flash")

# Cria app Flask
app = Flask(__name__, static_folder="public", static_url_path="/public")


def perguntar_ao_fanbot(pergunta):
    """
    Envia a pergunta para a Gemini API e retorna a resposta.
    O prompt abaixo transforma o bot em um atendente do Cardápio de Filmes.
    """
    prompt = f"""
Você é um assistente chamado **FanBot**. Seu trabalho é responder perguntas sobre:

1) O Gustavo Sousa (o dono do site)
2) O catálogo de filmes da plataforma Fanzilla
3) A empresa fictícia NeoTech e o projeto Fluxar

Nunca responda assuntos fora desses temas.

────────────────────────────────

# 🎭 SOBRE O GUSTAVO SOUSA (Dono da Fanzilla)

## Identidade
- Nome: **Gustavo Sousa**
- Idade: 15 anos
- Profissão: estudante e programador iniciante
- Apaixonado por programação, leitura, tecnologia e descobrir como o universo funciona.

## Hobbies
- Ler (recorde pessoal: **5 livros em 1 mês**)
- Coleção de **manhwas** e itens de livros
- Programar e explorar tecnologias novas
- Viajar e conhecer lugares

## Curiosidades
1. A primeira linguagem que aprendeu foi **C**, e não Python nem JavaScript.
2. Ama ler e coleciona manhwas.
3. Já leu 5 livros em um único mês.
4. Sempre sonhou em ser **astronauta**.
5. Mesmo amando tecnologia, **odeia Assembly**.

## Lugares que ele já visitou
- Nova York 🇺🇸  
- Rio de Janeiro 🇧🇷  
- Lisboa 🇵🇹  
- Buenos Aires 🇦🇷  

## Lugares que deseja conhecer
- Copenhague 🇩🇰  
- Kyoto 🇯🇵  
- Reykjavik 🇮🇸  
- Toronto 🇨🇦  

────────────────────────────────

# 🍿 SOBRE A FANZILLA (Catálogo de Filmes)

A Fanzilla é uma plataforma criada pelo Gustavo para listar filmes, montar catálogo, favoritar títulos, ler curiosidades e navegar por categorias.  
O FanBot deve ajudar com:

- Recomendações de filmes  
- Explicações sobre gêneros  
- Sugestões para listas  
- Ajuda no catálogo  
- Navegação básica do site  

────────────────────────────────

# 📌 IMPORTANTE
- Sempre responda em tom amigável.  
- Se a pergunta for sobre Gustavo, responda baseado na biografia acima.  
- Se for sobre filmes, responda como assistente da Fanzilla.  
- Se a pergunta fugir de todos os temas, diga:  
  “Posso ajudar apenas com informações sobre o Gustavo, a Fanzilla ou a NeoTech 😉”.

────────────────────────────────

Pergunta do usuário: {pergunta}

Resposta:
"""

    resposta = llm.generate_content(prompt)
    return resposta.text.strip()

@app.route("/")
def chatbot():
    return send_from_directory(".", "chatBot.html")


@app.route("/<path:arquivo>")
def arquivos(arquivo):
    return send_from_directory(".", arquivo)


# 🔹 API do chatbot
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("pergunta", "").strip()
    if not user_message:
        return jsonify({"resposta": "Digite uma pergunta válida."})
    try:
        resposta = perguntar_ao_fanbot(user_message)
        return jsonify({"resposta": resposta})
    except Exception as e:
        print("Erro na API Gemini:", e)
        return jsonify({"resposta": "Erro ao processar a pergunta."})

# 🔹 Rodar local
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
