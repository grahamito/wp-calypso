/**
 * External dependencies
 */
import React from 'react';
import snakeCase from 'lodash/snakeCase';
import includes from 'lodash/includes';
import once from 'lodash/once';
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
const _dismissedPreferenceKey = 'dismissedBrazilianSurvey';
const _sectionWhiteList = [ 'reader', 'sites' ];

function shouldDisplay() {
	return 'pt-br' === user.get().localeSlug;
}

function recordEvent( eventAction ) {
	googleAnalytics.recordEvent( 'Brazil Survey Invitation', eventAction );
	const tracksEventName = 'calypso_poll_invitation_' + snakeCase( eventAction );
	debug( 'recording event ' + tracksEventName );
	tracks.recordEvent( tracksEventName );
}

const recordDisplayedEventOnce = once( () => recordEvent( 'Displayed' ) );

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

		if ( this.props.preferences[ _dismissedPreferenceKey ] ) {
			debug( 'hiding: user has dismissed invitation' );
			return null;
		}

		if ( ! includes( _sectionWhiteList, this.props.section.name ) ) {
			debug( 'hiding: invalid section', this.props.section.name );
			return null;
		}

		recordDisplayedEventOnce();

		return (
			<div className="translator-invitation welcome-message">
				<div className="translator-invitation__primary-content">
					<h3 className="translator-invitation__title">Como está o nosso trabalho no Brasil?</h3> { /* no translate(), pt-br only */ }

					<div className="translator-invitation__secondary-content">
						<Gridicon icon="globe" size={ 48 } className="translator-invitation__content-icon" />
						<p className="translator-invitation__intro">
							Nós gostaríamos de lhe fazer 7 perguntas sobre o WordPress.com no Brasil.{ /* no translate(), pt-br only */ }
						</p>
						<div className="translator-invitation__actions">
							<button
								type="button"
								className="button is-primary"
								onClick={ this.acceptButton }>Responder a pesquisa</button> { /* no translate(), pt-br only */ }
							<button
								type="button"
								className="button"
								onClick={ this.dismissButton }>Não, obrigado</button> { /* no translate(), pt-br only */ }
						</div>
					</div>
				</div>
				<Gridicon className="translator-invitation__decoration" icon="globe" />
			</div>
		);
	},

	acceptButton: function() {
		const url = 'https://href.li/?http://9372672.polldaddy.com/s/brazilian-portuguese-user-survey';
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
		this.setState( { disabled: true } );
		recordEvent( 'dismissed' );
		preferencesActions.set( _dismissedPreferenceKey, true );
	}
} );
