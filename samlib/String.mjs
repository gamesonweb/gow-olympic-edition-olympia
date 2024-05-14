
export function dedent(str) {
    const smallestIndent = Math.min(...str
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.match(/^\s*/)[0].length)
    );
    return str
        .split('\n')
        .map(line => line.slice(smallestIndent))
        .join('\n');
}