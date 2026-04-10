import React from 'react';
import videoLinks from '../data/videoLinks';

export default function VideoLinksBar({ concept }) {
  const links = (concept && videoLinks[concept]) || [];
  if (!links || links.length === 0) return null;
  return (
    <div className="video-links-bar">
      <div className="video-links-inner">
        <strong>If not confident — watch:</strong>
        {links.map((v, i) => (
          <a key={i} href={v.url} target="_blank" rel="noreferrer">{v.title}</a>
        ))}
      </div>
    </div>
  );
}
