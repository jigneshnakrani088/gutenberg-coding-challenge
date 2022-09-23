/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Preview from './preview';

const CLASSNAME = 'x-block-country-card';

export default function Save( { attributes } ) {
	const blockProps = useBlockProps.save( {
		className: CLASSNAME,
	} );

	return (
		<div { ...blockProps }>
			<Preview { ...attributes } />
		</div>
	);
}
