/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import countries from '../assets/countries.json';
import continentNames from '../assets/continent-names.json';
import continents from '../assets/continents.json';
import { getEmojiFlag } from './utils';

const CLASSNAME = 'x-block-country-card-preview';

export default function Preview( { countryCode, relatedPosts } ) {
	if ( ! countryCode ) {
		return null;
	}

	const emojiFlag = getEmojiFlag( countryCode ),
		hasRelatedPosts = relatedPosts?.length > 0;

	const previewHeading = sprintf(
		'Hello from <strong>%1$s</strong> (<span class="%2$s">%3$s</span>), %4$s!',
		countries[ countryCode ],
		`${ CLASSNAME }__country-code`,
		countryCode,
		continentNames[ continents[ countryCode ] ]
	);

	return (
		<div className={ `${ CLASSNAME }` }>
			<div className={ `${ CLASSNAME }__media` } data-emoji-flag={ emojiFlag }>
				<div className={ `${ CLASSNAME }__media-flag` }>
					{ emojiFlag }
				</div>
			</div>
			<h2 className={ `${ CLASSNAME }__heading` }>
				<p
					dangerouslySetInnerHTML={ { __html: previewHeading } }
				/>
			</h2>
			<div className={ `${ CLASSNAME }__related-posts` }>
				<h3 className={ `${ CLASSNAME }__related-posts--heading` }>
					{ hasRelatedPosts ? (
						sprintf(
							/** translators: %d is Country related posts count */
							_n(
								'There is only %d related post.',
								'There are %d related posts.',
								relatedPosts.length,
								'xwp-country-card'
							),
							relatedPosts.length
						)
					) : (
						__( 'There are no related posts.', 'xwp-country-card' )
					) }
				</h3>
				{ hasRelatedPosts && (
					<ul className={ `${ CLASSNAME }__related-posts--lists` }>
						{ relatedPosts.map( ( relatedPost, index ) => (
							<li key={ index } className={ `${ CLASSNAME }__related-post` }>
								<a
									className={ `${ CLASSNAME }__related-post--link` }
									href={ relatedPost.link }
									data-post-id={ relatedPost.id }
								>
									<h3 className={ `${ CLASSNAME }__related-post--title` }>
										{ relatedPost.title }
									</h3>
									<p className={ `${ CLASSNAME }__related-post--excerpt` }>
										{ relatedPost.excerpt }
									</p>
								</a>
							</li>
						) ) }
					</ul>
				) }
			</div>
		</div>
	);
}
