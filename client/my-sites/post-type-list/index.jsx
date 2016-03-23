/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import QueryPosts from 'components/data/query-posts';
import { getSelectedSiteId } from 'state/ui/selectors';
import PostTypeListPosts from './posts';

function PostTypeList( { type, siteId } ) {
	const query = { type };

	return (
		<div className="post-type-list">
			<QueryPosts siteId={ siteId } query={ query } />
			<PostTypeListPosts query={ query } />
		</div>
	);
}

PostTypeList.propTypes = {
	type: PropTypes.string.isRequired,
	siteId: PropTypes.number
};

export default connect( ( state ) => {
	return {
		siteId: getSelectedSiteId( state )
	};
} )( PostTypeList );
