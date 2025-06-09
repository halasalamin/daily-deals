import * as React from 'react';

function SvgDelete (props) {
	return (
		<svg width="22px" height="22px" viewBox="0 0 19 20" {...props}>
			<defs>
				<path id="delete_svg__a" d="M0 .276h19.085v1.701H0z" />
			</defs>
			<g fill="none" fillRule="evenodd">
				<g transform="translate(0 4.005)">
					<mask id="delete_svg__b" fill="#fff">
						<use xlinkHref="#delete_svg__a" />
					</mask>
					<path
						fill={props.color || '#AAA2AA'}
						d="M18.234 1.977H.85a.85.85 0 010-1.7h17.384a.85.85 0 110 1.7"
						mask="url(#delete_svg__b)"
					/>
				</g>
				<path
					fill={props.color || '#AAA2AA'}
					d="M6.61 4.281h6.235V2.397a.697.697 0 00-.696-.696H7.307a.697.697 0 00-.696.696v1.884zm7.937 1.701H4.91V2.397A2.4 2.4 0 017.307 0h4.842a2.4 2.4 0 012.398 2.397v3.585zm.045 14.023H4.694a2.584 2.584 0 01-2.581-2.581v-9.24a.85.85 0 111.7 0v9.24c0 .485.395.88.88.88h9.899a.88.88 0 00.879-.88v-9.24a.851.851 0 111.702 0v9.24a2.584 2.584 0 01-2.581 2.58"
				/>
				<path
					fill={props.color || '#AAA2AA'}
					d="M7.759 16.22a.851.851 0 01-.851-.852v-5.095a.851.851 0 111.702 0v5.095c0 .47-.381.851-.851.851m3.767.001a.851.851 0 01-.85-.852v-5.095a.851.851 0 111.701 0v5.095a.85.85 0 01-.85.851"
				/>
			</g>
		</svg>
	);
}

export default SvgDelete;