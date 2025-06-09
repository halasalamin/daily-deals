import React from 'react';

function SvgEdit(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 19 20" {...props}>
      <defs>
        <path id="edit_svg__a" d="M0 .995h18.054V20H0z" />
        <path id="edit_svg__c" d="M.096.187h11.32v11.916H.096z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(0 -.187)">
          <mask id="edit_svg__b" fill="currentColor">
            <use xlinkHref="#edit_svg__a" />
          </mask>
          <path
            fill="#939090"
            d="M14.779 20H3.275C1.47 20 0 18.453 0 16.552V4.443C0 2.542 1.47.995 3.275.995h9.106c.43 0 .778.367.778.819 0 .453-.348.82-.778.82H3.275c-.947 0-1.718.811-1.718 1.809v12.109c0 .998.771 1.809 1.718 1.809H14.78c.948 0 1.718-.811 1.718-1.809V7.256c0-.452.349-.819.778-.819.43 0 .78.367.78.819v9.296c0 1.901-1.47 3.448-3.276 3.448"
            mask="url(#edit_svg__b)"
          />
        </g>
        <g transform="translate(7.6 -.187)">
          <mask id="edit_svg__d" fill="currentColor">
            <use xlinkHref="#edit_svg__c" />
          </mask>
          <path
            fill="#939090"
            d="M1.542 12.104L.154 12.04l-.058-1.46L9.67.502a.99.99 0 011.447 0c.4.421.4 1.104 0 1.524L1.542 12.104z"
            mask="url(#edit_svg__d)"
          />
        </g>
      </g>
    </svg>
  );
}

export default SvgEdit;