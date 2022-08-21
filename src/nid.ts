let cid = 1;
let nid = cid;

export function getNextId() {
  nid = cid + 1;

  // If max javascirpt number
  if (nid === cid) {
    cid = nid = 1;

    return nid;
  }

  cid = nid;

  return nid;
}
