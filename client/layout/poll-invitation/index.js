/**
 * External dependencies
 */
import React from 'react';
import snakeCase from 'lodash/snakeCase';
import includes from 'lodash/includes';
import memoize from 'lodash/memoize';
import debugModule from 'debug';

/**
 * Internal dependencies
 */
import userModule from 'lib/user';
import { ga as googleAnalytics } from 'analytics';
import Gridicon from 'components/gridicon';
import { tracks } from 'analytics';
import config from 'config';
import preferencesActions from 'lib/preferences/actions';

/**
 * Module variables
 */
const debug = debugModule( 'calypso:poll-invitation' );
const user = userModule();
const _preferencesKey = 'dismissedBrazilianSurvey';
const _sectionWhiteList = [ 'reader', 'sites' ];

function shouldDisplay() {
	return 'pt-br' === user.get().localeSlug;
}

function recordEvent( eventAction ) {
	googleAnalytics.recordEvent( 'Translator Invitation', eventAction );
	let tracksEventName = 'calypso_poll_invitation_' + snakeCase( eventAction );
	debug( 'recording event ' + tracksEventName );
	tracks.recordEvent( tracksEventName );
}

let recordEventOnce = memoize( recordEvent );

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
			isVisible: true
		};
	},

	render: function() {
		if ( this.state.disabled ) {
			debug( 'hiding: has been disabled' );
			return null;
		}

		if ( ! this.props.isVisible ) {
			debug( 'hiding: hidden by parent' );
			return null;
		}

		if ( ! config.isEnabled( 'brazil-survey-invitation' ) ) {
			debug( 'hiding: not enabled in config' );
			return null;
		}

		if ( ! this.props.preferences ) {
			debug( 'hiding: user preferences not loaded' );
			return null;
		}

		if ( this.props.preferences[ _preferencesKey ] ) {
			debug( 'hiding: user has dismissed invitation' );
			return null;
		}

		if ( ! includes( _sectionWhiteList, this.props.section.name ) ) {
			debug( 'hiding: invalid section', this.props.section.name );
			return null;
		}

		recordEventOnce( 'Displayed' );

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
		this.dismiss();
	},

	dismissButton: function() {
		recordEvent( 'Clicked Dismiss Button' );
		this.dismiss();
	},

	dismiss: function() {
		debug( 'dismiss' );
		this.state.disabled = true;
		recordEvent( 'dismissed' );
		this.state.disabled = true;
		preferencesActions.set( _preferencesKey, true );
	}
} );
