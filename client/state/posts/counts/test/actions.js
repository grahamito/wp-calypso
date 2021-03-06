/**
 * External dependencies
 */
import nock from 'nock';
import sinon from 'sinon';
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	POST_COUNTS_RECEIVE,
	POST_COUNTS_REQUEST,
	POST_COUNTS_REQUEST_SUCCESS,
	POST_COUNTS_REQUEST_FAILURE
} from 'state/action-types';
import {
	receivePostCounts,
	requestPostCounts
} from '../actions';

describe( 'actions', () => {
	const spy = sinon.spy();

	beforeEach( () => {
		spy.reset();
	} );

	after( () => {
		nock.cleanAll();
	} );

	describe( '#receivePostCounts()', () => {
		it( 'should return an action object', () => {
			const counts = {
				all: { publish: 2 },
				mine: { publish: 1 }
			};
			const action = receivePostCounts( 2916284, 'post', counts );

			expect( action ).to.eql( {
				type: POST_COUNTS_RECEIVE,
				siteId: 2916284,
				postType: 'post',
				counts
			} );
		} );
	} );

	describe( '#requestPostCounts()', () => {
		before( () => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.get( '/wpcom/v2/sites/2916284/post-counts/post' )
				.reply( 200, {
					body: {
						counts: {
							all: { publish: 2 },
							mine: { publish: 1 }
						}
					},
					status: 200,
					headers: {
						Allow: 'GET'
					}
				} )
				.get( '/wpcom/v2/sites/2916284/post-counts/foo' )
				.reply( 404, {
					body: {
						code: 'unknown_post_type',
						message: 'Unknown post type requested'
					},
					status: 404,
					headers: {
						Allow: 'GET'
					}
				} );
		} );

		it( 'should dispatch request action when thunk triggered', () => {
			requestPostCounts( 2916284, 'post' )( spy );

			expect( spy ).to.have.been.calledWith( {
				type: POST_COUNTS_REQUEST,
				siteId: 2916284,
				postType: 'post'
			} );
		} );

		it( 'should dispatch receive action when request succeeds', () => {
			return requestPostCounts( 2916284, 'post' )( spy ).then( () => {
				expect( spy ).to.have.been.calledWith( {
					type: POST_COUNTS_RECEIVE,
					siteId: 2916284,
					postType: 'post',
					counts: {
						all: { publish: 2 },
						mine: { publish: 1 }
					}
				} );
			} );
		} );

		it( 'should dispatch success action when request succeeds', () => {
			return requestPostCounts( 2916284, 'post' )( spy ).then( () => {
				expect( spy ).to.have.been.calledWith( {
					type: POST_COUNTS_REQUEST_SUCCESS,
					siteId: 2916284,
					postType: 'post'
				} );
			} );
		} );

		it( 'should dispatch fail action when request fails', () => {
			return requestPostCounts( 2916284, 'foo' )( spy ).then( () => {
				expect( spy ).to.have.been.calledWith( {
					type: POST_COUNTS_REQUEST_FAILURE,
					siteId: 2916284,
					postType: 'foo',
					error: sinon.match( { body: { code: 'unknown_post_type' } } )
				} );
			} );
		} );
	} );
} );
