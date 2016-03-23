/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import {
	isRequestingSitePostsForQuery,
	getSitePostsForQueryIgnoringPage
} from 'state/posts/selectors';
import PostTypeListPost from './post';
import PostTypeListPostPlaceholder from './post-placeholder';

function PostTypeListPosts( { requesting, posts } ) {
	const classes = classnames( 'post-type-list__posts', {
		'is-loading': requesting
	} );

	return (
		<ul className={ classes }>
			{ posts && posts.map( ( post ) => (
				<li key={ post.global_ID }>
					<PostTypeListPost globalId={ post.global_ID } />
				</li>
			) ) }
			{ requesting && (
				<li><PostTypeListPostPlaceholder /></li>
			) }
		</ul>
	);
}

PostTypeListPosts.propTypes = {
	requesting: PropTypes.bool,
	posts: PropTypes.array
};

export default connect( ( state, ownProps ) => {
	const siteId = getSelectedSiteId( state );

	return {
		posts: getSitePostsForQueryIgnoringPage( state, siteId, ownProps.query ),
		requesting: isRequestingSitePostsForQuery( state, siteId, ownProps.query )
	};
} )( PostTypeListPosts );
