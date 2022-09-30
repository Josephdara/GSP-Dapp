export default function handler(req, res) {
  const tokenID = req.query.tokenID;
  const name = `Glory Sound Prep #${tokenID}`;
  const description = "Glory Sound prep NFTs represented as Punks";
  const image = `https://raw.githubusercontent.com/Josephdara/GSP-Dapp/main/public/images/${
    Number(tokenID)
  }.png`;
  const attributes = `https://raw.githubusercontent.com/Josephdara/GSP-Dapp/main/public/json/${
    Number(tokenID)
  }.json`;

  return res.json({
    name: name,
    description: description,
    image: image,
    attributes: attributes,
  });
}
