/**
 * External dependencies
 */
import React from 'react';
import snakeCase from 'lodash/snakeCase';
import store from 'store';

let user = require( 'lib/user' )();
let debug = require( 'debug' )( 'calypso:poll-invitation' );

/**
 * Internal dependencies
 */
import { ga as googleAnalytics } from 'analytics';
import Gridicon from 'components/gridicon';
import { tracks } from 'analytics';
// import preferencesStore from 'lib/preferences/store';  TODO
// import preferencesActions from 'lib/preferences/actions'; // TODO

// TODO: add a key so we can automate the "have I been seen" check.
export default React.createClass( {
	displayName: 'PollInvitation',

	propTypes: {
		isVisible: React.PropTypes.bool
	},

	getInitialState: function() {
		return {
			disabled: ! shouldDisplay()
		};
	},
	getDefaultProps: function() {
		return {
			isVisible: shouldDisplay()
		};
	},

	render: function() {
		if ( ( ! this.props.isVisible ) || this.state.disabled ) {
			return null;
		}

		recordEvent( 'displayed' );

		let subComponents = {
			title: 'Como está o nosso trabalho no Brasil?', // no translate(), pt-br only
			acceptButtonText: 'Responder a pesquisa',       // no translate(), pt-br only
			dismissButtonText: 'Não, obrigado',             // no translate(), pt-br only
			content: 'Nós gostaríamos de lhe fazer 7 perguntas sobre o WordPress.com no Brasil.' // no translate(), pt-br only
		};

		return (
			<div className="translator-invitation welcome-message">
				<div className="translator-invitation__primary-content">
					<h3 className="translator-invitation__title">{ subComponents.title }</h3>

					<div className="translator-invitation__secondary-content">
						<Gridicon icon="globe" size={ 48 } className="translator-invitation__content-icon" />
						<p className="translator-invitation__intro">
							{ subComponents.content }
						</p>
						<div className="translator-invitation__actions">
							<button
								type="button"
								className="button is-primary"
								onClick={ this.acceptButton }>
								{ subComponents.acceptButtonText }
							</button>
							<button
								type="button"
								className="button"
								onClick={ this.dismissButton }>
								{ subComponents.dismissButtonText }
							</button>
						</div>
					</div>
				</div>
				<Gridicon className="translator-invitation__decoration" icon="globe" />
			</div>
		);
	},

	acceptButton: function() {
		let url = 'https://href.li/?http://9372672.polldaddy.com/s/brazilian-portuguese-user-survey';
		recordEvent( 'Clicked Accept Button' );
		window.open( url );
	// invitationUtils.activate();
		this.permanentlyDisableInvitation();
	},

	dismissButton: function() {
		recordEvent( 'Clicked Dismiss Button' );
		this.permanentlyDisableInvitation();
	},

	dismiss: function() {
		debug( 'dismiss' );
		store.set( 'interactedWithPollInvitiation', true );
		this.state.disabled = true;
	},

	permanentlyDisableInvitation: function() {
		this.dismiss();
		debug( 'permanently disabling' );
		recordEvent( 'dismissed' );
		// preferencesActions.set( 'pt-br-polled', true );
		// invitationPending = false;
		// invitationUtils.emitChange();
	}
} );

function shouldDisplay() {
	return 'pt-br' === user.get().localeSlug &&
		! store.get( 'interactedWithPollInvitiation' );
}

function recordEvent( eventAction ) {
	googleAnalytics.recordEvent( 'Translator Invitation', eventAction );
	let tracksEventName = 'calypso_poll_invitation_' + snakeCase( eventAction );
	debug( 'recording event ' + tracksEventName );
	tracks.recordEvent( tracksEventName );
}
