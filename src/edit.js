/**
 * WordPress dependencies
 */
import { edit, globe } from '@wordpress/icons';
import { BlockControls, useBlockProps } from '@wordpress/block-editor';
import {
	ComboboxControl,
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
	Spinner,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import countries from '../assets/countries.json';
import { getEmojiFlag } from './utils';
import Preview from './preview';

const CLASSNAME = 'x-block-country-card';
const OPTIONS = Object.entries( countries ).map( ( [ code, name ] ) => ( {
	value: code,
	label: `${ getEmojiFlag( code ) } ${ name } - ${ code }`,
} ) );

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object} props Block properties
 *
 * @return {JSX.Element} Block element.
 */
export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { countryCode, relatedPosts } = attributes;
	const [ isPreview, setPreview ] = useState( !! countryCode );
	const [ isLoading, setIsLoading ] = useState( ! countryCode );

	const handleChangeCountryCode = ( newCountryCode ) => {
		if ( countryCode !== newCountryCode ) {
			setIsLoading( true );
			setAttributes( {
				countryCode: newCountryCode,
				relatedPosts: [],
			} );
		}
	};

	const { fetchedRelatedPosts, fetchedRelatedPostsContent } = useSelect( ( select ) => {
		if ( ! countryCode ) {
			return {};
		}

		const queryParams = {
			per_page: 10,
			status: 'publish',
			_fields: [ 'id', 'link', 'title', 'excerpt' ],
			search: countries[ countryCode ],
			exclude: wp.data.select( 'core/editor' ).getCurrentPostId(),
		};

		const posts = select( 'core' ).getEntityRecords(
			'postType',
			'post',
			queryParams
		);
		if ( null !== posts ) {
			const fetchedPosts = posts?.map( ( relatedPost ) => ( {
				id: relatedPost.id,
				link: relatedPost.link,
				title: relatedPost.title?.rendered || '',
				excerpt: relatedPost.excerpt?.raw || '',
			} ) );

			setIsLoading( false );
			return {
				fetchedRelatedPosts: fetchedPosts,
				fetchedRelatedPostsContent: JSON.stringify(
					fetchedPosts
				),
			};
		}
	}, [ countryCode ] ) || [];

	useEffect( () => {
		setAttributes( { relatedPosts: fetchedRelatedPosts } );
	}, [ fetchedRelatedPostsContent ] );

	useEffect( () => {
		setPreview( !! countryCode );
	}, [ countryCode ] );

	const handleChangeCountry = () => {
		setAttributes( {
			countryCode: false,
			relatedPosts: [],
		} );
	};

	const blockProps = useBlockProps( {
		className: CLASSNAME,
	} );

	if ( isLoading ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon={ globe }
					label={ __( 'Fetching Posts…', 'xwp-country-card' ) }
				>
					<Spinner />
				</Placeholder>
			</div>
		);
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						label={ __( 'Change Country', 'xwp-country-card' ) }
						icon={ edit }
						onClick={ handleChangeCountry }
						disabled={ ! Boolean( countryCode ) }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...blockProps }>
				{ isPreview ? (
					<Preview
						countryCode={ countryCode }
						relatedPosts={ relatedPosts }
					/>
				) : (
					<Placeholder
						icon={ globe }
						label={ __( 'XWP Country Card', 'xwp-country-card' ) }
						isColumnLayout={ true }
						instructions={ __(
							'Type in a name of a country you want to display on your site.',
							'xwp-country-card'
						) }
					>
						<ComboboxControl
							label={ __( 'Country', 'xwp-country-card' ) }
							hideLabelFromVision
							options={ OPTIONS }
							value={ countryCode }
							onChange={ handleChangeCountryCode }
							allowReset={ true }
						/>
					</Placeholder>
				) }
			</div>
		</>
	);
}
