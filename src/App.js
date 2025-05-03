import React, { useState } from "react";
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

export default function XmlSkeletonApp() {
  const [input, setInput] = useState("");
  const [skeleton, setSkeleton] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    try {
      const parser = new window.DOMParser();
      const xmlDoc = parser.parseFromString(input, "text/xml");
      const root = xmlDoc.documentElement;
      const skeletonXml = getSkeleton(root);
      setSkeleton(skeletonXml);
    } catch (err) {
      setSkeleton("Invalid XML");
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
          <label className="custom-label" htmlFor="textbox2">XML Skeleton</label>
          <textarea
            id="textbox2"
            className="custom-input"
            placeholder="Textbox 2"
            value={skeleton}
            readOnly
            rows={20}
            cols={60}
          />
        </div>
      </div>
      <button className="custom-button" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
