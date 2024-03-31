
export async function GET(req: Request) {
  const response = await fetch('https://matchmaker.krunker.io/game-list?hostname=krunker.io');
  const data = await response.json();
  return Response.json(data);
}
