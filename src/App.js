import React, { useState, useRef, useEffect } from "react";
import './App.css';

function getSkeleton(node, indent = 0) {
  if (node.nodeType !== 1) return ""; // Only process element nodes

  const children = Array.from(node.children);
  const uniqueTags = [...new Set(children.map(child => child.tagName))];

  const indentStr = '  '.repeat(indent);
  let skeleton = `${indentStr}<${node.tagName}>`;

  if (uniqueTags.length > 0) {
    uniqueTags.forEach(tag => {
      const child = children.find(c => c.tagName === tag);
      skeleton += "\n" + getSkeleton(child, indent + 1);
    });
    skeleton += `\n${indentStr}`;
  }

  skeleton += `</${node.tagName}>`;
  return skeleton;
}

function xmlToJqTreeData(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  function nodeToTree(node) {
    if (node.nodeType === 3 && !node.nodeValue.trim()) return null;
    if (node.nodeType === 3) {
      return { label: node.nodeValue.trim() };
    }
    const children = [];
    for (let i = 0; i < node.childNodes.length; i++) {
      const childTree = nodeToTree(node.childNodes[i]);
      if (childTree) children.push(childTree);
    }
    if (children.length === 0) {
      return { label: node.nodeName };
    }
    return {
      label: node.nodeName,
      children: children
    };
  }
  const root = xmlDoc.documentElement;
  return [nodeToTree(root)];
}

export default function XmlSkeletonApp() {
  const [input, setInput] = useState("");
  const treeRef = useRef(null);
  const [treeJson, setTreeJson] = useState([]);

  useEffect(() => {
    if (treeRef.current && treeJson.length > 0 && window.$) {
      window.$(treeRef.current).tree({
        data: treeJson,
        autoOpen: true,
        dragAndDrop: true
      });
    }
  }, [treeJson]);

  const handleSubmit = e => {
    e.preventDefault();
    try {
      const parser = new window.DOMParser();
      const xmlDoc = parser.parseFromString(input, "text/xml");
      const skeletonXml = getSkeleton(xmlDoc.documentElement);
      
      const treeData = xmlToJqTreeData(skeletonXml);
      setTreeJson(treeData);

    } catch (err) {
      setTreeJson([]);
    }
  };

  return (
    <div className="App">
      <div className="input-container">
        <div className="input-group">
          <label className="custom-label" htmlFor="textbox1">Original XML</label>
          <textarea
            id="textbox1"
            className="custom-input"
            placeholder="Textbox 1"
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={20}
            cols={60}
          />
        </div>
        <div className="input-group">
          <label className="custom-label" htmlFor="textbox3">JqTree Data</label>
          <div ref={treeRef} id="jqtree" style={{ background: '#ddd', padding: 10, minHeight: 770, marginTop: 8 }} />
        </div>
      </div>
      <button className="custom-button" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
