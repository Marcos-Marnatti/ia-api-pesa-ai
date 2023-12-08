import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { streamToResponse, OpenAIStream } from 'ai';
import { openai } from "../lib/openai";

const promptMontagemDieta = "Seu papel é montar uma dieta especifica com base no gasto calórico e objetivo do paciente.\n\nAbaixo você receberá um Pedido de dieta, use as informações passadas para criar o cardápio completo.\nPreste atenção no número de kcal que será pedido, objetivo do paciente e o número de refeições.\nO objetivo pode ser divido em apenas três categorias como esta escrito abaixo:\n1 - Ganho de massa muscular\n2 - Perda de Gordura\n3 - Manutenção \n\nNão invente o que você não souber.\nVocê deve procurar somento dados relacionado a nutrição e alimentação.\nVocê é responsável por entregar opções de alimentos mantendo a equivalência de seus macronutrientes.\nVocê deve avaliar com muita precisão, sendo de extrema importância que seja realizado um calculo onde as calorias não ultrapassem o limite imposto.\nMonte a dieta de acordo com o total de calorias que o usuário irá passar.\nVocê pode usar a Tabela Brasileira de Composição de Alimentos(TACO) como base.\nVocê só pode passar os alimentos usando a medida em gramas.\nVocê pode passar somente um alimento pro linha.\nUma refeição não pode chegar a 50g de proteinas totais.\nMande somente as refeições, sem nenhuma observação.\n\n\nRetorne o cardápio como no formato abaixo:\n\nRefeição 1\n- Leite desnatado (200ml) [quantidade calorias]\n- Banana (100g) [quantidade calorias]\n- Omelete de claras (3 unidades) [quantidade calorias]\n\nPedido de dieta:\nPreciso de um cardapio para uma dieta de {totalCalorias} kcal para {objetivoPaciente} dividida em {qtdRefeicoes} refeições\n";
const promptDuvidas = "Seu papel é ajudar o paciente com dúvidas sobre nutrição, dieta, alimentação e exercícios.\n  \nAbaixo você receberá uma pergunta sobre nutrição, dieta, alimentação e exercícios, responda com a maior exatidão possível.\nA resposta não deve ser muito extensa, somente em casos necessários.\nExplique como se estivesse explicando a uma criança.\n\nNão invente o que você não souber.\nSe a pergunta do paciente não abordar nutrição, dieta, alimentação ou exercícios, sua resposta deve ser: *Desculpe, mas só posso responder perguntas relacionadas a saúde.\"\n\nPergunta:\n'''\n{pergunta}\n'''";

export async function generationAICompletionRoute(app: FastifyInstance) {
  app.post('/ai/complete', async (request, reply) => {
    const bodySchema = z.object({
      calories: z.string(),
      goal: z.string(),
      meals: z.string(),
      temperature: z.number().min(0).max(1).default(0.5)
    })

    const { calories, goal, meals, temperature } = bodySchema.parse(request.body);

    console.log(promptMontagemDieta);
    const promptMessage = promptMontagemDieta.replace('{totalCalorias}', calories).replace('{objetivoPaciente}', goal).replace('{qtdRefeicoes}', meals);
    console.log(promptMessage);

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature,

      messages: [
        { role: 'user', content: promptMessage }
      ],
      stream: true,
    });

    const stream = OpenAIStream(response);

    streamToResponse(stream, reply.raw, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    })
  });

  app.post('/ai-question/complete', async (request, reply) => {
    const bodySchema = z.object({
      question: z.string(),
      temperature: z.number().min(0).max(1).default(0.5)
    })

    const { question, temperature } = bodySchema.parse(request.body);

    console.log(promptDuvidas);
    const promptMessage = promptDuvidas.replace('{pergunta}', question);
    console.log(promptMessage);

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature,

      messages: [
        { role: 'user', content: promptMessage }
      ],
      stream: true,
    });

    const stream = OpenAIStream(response);

    streamToResponse(stream, reply.raw, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    })
  });
}