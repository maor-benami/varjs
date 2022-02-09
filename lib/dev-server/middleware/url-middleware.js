export default (req) => {
  let chunks = req.url.split('/').filter(Boolean);
  let lastChunk = chunks && chunks[chunks.length - 1];
  let split = lastChunk?.split('.') || [];
  let name = split[0];
  let ext = split[split.length - 1] !== lastChunk ? split[split.length - 1] : null;

  return {
    name,
    ext,
    chunks
  };
};
