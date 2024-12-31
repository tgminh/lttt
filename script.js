function encodeShannon() {
    const input = document.getElementById('shannon-input').value;
    const output = shannonEncode(input);
    document.getElementById('shannon-output').innerText = output;
}

function decodeShannon() {
    const input = document.getElementById('shannon-input').value;
    const output = shannonDecode(input);
    document.getElementById('shannon-output').innerText = output;
}

function encodeHuffman() {
    const input = document.getElementById('huffman-input').value;
    const output = huffmanEncode(input);
    document.getElementById('huffman-output').innerText = output;
}

function decodeHuffman() {
    const input = document.getElementById('huffman-input').value;
    const output = huffmanDecode(input);
    document.getElementById('huffman-output').innerText = output;
}

function encodeFano() {
    const input = document.getElementById('fano-input').value;
    const output = fanoEncode(input);
    document.getElementById('fano-output').innerText = output;
}

function decodeFano() {
    const input = document.getElementById('fano-input').value;
    const output = fanoDecode(input);
    document.getElementById('fano-output').innerText = output;
}

// Sample encoding/decoding functions (implement these properly)
function shannonEncode(text) {
    // Implement Shannon encoding
    return "Encoded with Shannon: " + text;
}

function shannonDecode(text) {
    // Implement Shannon decoding
    return "Decoded with Shannon: " + text;
}

function huffmanEncode(text) {
    // Implement Huffman encoding
    return "Encoded with Huffman: " + text;
}

function huffmanDecode(text) {
    // Implement Huffman decoding
    return "Decoded with Huffman: " + text;
}

function fanoEncode(text) {
    // Implement Fano encoding
    return "Encoded with Fano: " + text;
}

function fanoDecode(text) {
    // Implement Fano decoding
    return "Decoded with Fano: " + text;
}