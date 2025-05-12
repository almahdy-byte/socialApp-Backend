class Node {
    constructor(char, freq, left = null, right = null) {
      this.char = char;
      this.freq = freq;
      this.left = left;
      this.right = right;
    }
  }
  
  // بناء شجرة هوفمان
  function buildHuffmanTree(text) {
    const freqMap = new Map();
  
    // 1. حساب التكرار
    for (let char of text) {
      freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }
  
    // 2. تحويل التكرارات إلى نودات
    let nodes = Array.from(freqMap, ([char, freq]) => new Node(char, freq));
  
    // 3. بناء الشجرة
    while (nodes.length > 1) {
      // ترتيب النودات حسب التكرار
      nodes.sort((a, b) => a.freq - b.freq);
  
      // دمج أقل عنصرين
      const left = nodes.shift();
      const right = nodes.shift();
  
      const merged = new Node(null, left.freq + right.freq, left, right);
      nodes.push(merged);
    }
  
    return nodes[0]; // root node
  }
  
  // بناء كودات هوفمان
  function buildCodes(node, path = "", map = {}) {
    if (!node.left && !node.right) {
      map[node.char] = path;
    }
    if (node.left) buildCodes(node.left, path + "0", map);
    if (node.right) buildCodes(node.right, path + "1", map);
    return map;
  }
  
  // دالة الضغط
  export function huffmanEncode(text) {
    const tree = buildHuffmanTree(text);
    const codes = buildCodes(tree);
  
    let encoded = "";
    for (let char of text) {
      encoded += codes[char];
    }
  
    return { encodedText: encoded, tree };
  }
  
  // دالة فك الضغط
  export function huffmanDecode(encodedText, tree) {
    let result = "";
    let node = tree;
  
    for (let bit of encodedText) {
      node = bit === "0" ? node.left : node.right;
  
      if (!node.left && !node.right) {
        result += node.char;
        node = tree; // reset to root
      }
    }
  
    return result;
  }
