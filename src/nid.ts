let cid = 1;
let nid = cid;

export function getNextId() {
  nid = cid + 1;

  // 超过最大数
  if (nid === cid) {
    cid = nid = 1;

    return nid;
  }

  cid = nid;

  return nid;
}
