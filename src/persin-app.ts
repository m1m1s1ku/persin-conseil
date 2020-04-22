import { LitElement, html, property, queryAll, query, customElement } from 'lit-element';
import { supportsWebp } from './images';

import { TextField } from '@material/mwc-textfield';
import { Dialog } from '@material/mwc-dialog';
import { Button } from '@material/mwc-button';

// Offline plugin for production builds
if(location.host.indexOf('localhost') === -1){
	const OfflinePluginRuntime = require('offline-plugin/runtime');
	OfflinePluginRuntime.install();
}

import '@material/mwc-icon';
import '@material/mwc-icon-button';
import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-textarea';

enum ImageFormats {
	webp = 'webp',
	jpg = 'jpg'
};

@customElement('persin-app')
export class PersinApp extends LitElement {
	@property({type: String})
	private currentSection: string;

	@property({type: String})
	private imageFormat: string;

	@queryAll('.image-format')
	private _switchables: NodeListOf<HTMLDivElement>;

	@property({type: Object})
	private isOnline: boolean;

	@query('#legal')
	private legal: Dialog;

	@query('#mobileMenu')
	private mobileMenu: HTMLDivElement;

	@query('#sendmail')
	private sendmail: Button

	private readonly _listenersOptions: AddEventListenerOptions = { passive: true };
	private _onSectionChange: IntersectionObserverCallback = this._onSectionsChange.bind(this);
	private _sectionsObserver = new IntersectionObserver(this._onSectionChange, {
		rootMargin: '100px',
		threshold: 1.0
	});

	private _onlineStatusChange = this._onOnlineStatusChange.bind(this);
	private _resize = this._onResize.bind(this);

	public async connectedCallback(){
		super.connectedCallback();

		this.imageFormat = await supportsWebp() ? ImageFormats.webp : ImageFormats.jpg;
		this.isOnline = navigator.onLine;

		window.addEventListener('online',  this._onlineStatusChange, this._listenersOptions);
		window.addEventListener('offline', this._onlineStatusChange, this._listenersOptions);
		window.addEventListener('resize', this._resize, this._listenersOptions);
	}

	public disconnectedCallback(){
		super.disconnectedCallback();

		window.removeEventListener('online',  this._onlineStatusChange, this._listenersOptions);
		window.removeEventListener('offline', this._onlineStatusChange, this._listenersOptions);
		window.removeEventListener('resize', this._resize, this._listenersOptions);
	}

	private _onSectionsChange(changes: IntersectionObserverEntry[]){
		for(const change of changes){
			if(change.isIntersecting){
				const id = change.target.id;
				if(id){
					this.currentSection = id;
				}
			}
		}
	}

	// NOTE : never update a prop into that ! (re-render)
	public async firstUpdated(){
		const sections = Array.from(this.querySelectorAll('.section'));
		const shadowSections = Array.from(this.shadowRoot.querySelectorAll('.section'));

		for(const section of [...sections, ...shadowSections]){
			this._sectionsObserver.observe(section);
		}

		if(this.imageFormat === ImageFormats.webp){
			return;
		}

		for(const switchable of Array.from(this._switchables)){
			switchable.classList.remove(ImageFormats.webp);
			switchable.classList.remove(ImageFormats.jpg);
		}
	}

	private get _links(){
		return [
			{ class: 'home', content: html`<mwc-icon>home</mwc-icon>`},
			{ class: 'conseil', content: 'Conseil' },
			{ class: 'installation', content: 'Installation' },
			{ class: 'formation', content: 'Formation' },
			{ class: 'assistance', content: 'Assistance' },
			{ class: 'contact', content: 'Contact' }
		];
	}

	private get _nav(){
		return html`<nav><ul>${this._links.map((link) => html`
		<li class="${link.class}${link.class === this.currentSection ? ' active' : ''}" @click="${(e) => this._onNavClick(e, link, true)}">
			<a href="#${link.class}">
				${link.content}
			</a>
		</li>`)}</ul></nav>`;
	}

	public render() {
		return html`
			<style>
			section { position: relative; width: 100%; height: 100% }
			.section.text-content h2 {
				align-self: flex-start;
				color: var(--persin-dark-green);
			}

			.section.text-content.white p {
				color: white;
			}
			.contact.webp { background-image: url('./assets/parallax/contact.webp');}
    		.contact.jpg { background-image: url('./assets/parallax/contact.jpg');}

			.app {
				text-align: center;
				font-family: 'IBM Plex Sans', sans-serif;
				overflow: hidden;
			}

			.app-header {
				position: fixed;
				width: 100%;
				z-index: 999;
				background-color: var(--persin-green);
				color: white;
				height: 50px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
			}

			.app-header {
				user-select: none;
			}

			.app-header h1 {
				color: black;
				font-size: 1.1em;
				font-weight: bold;
				cursor: pointer;
				outline: none;
				text-transform: uppercase;
				padding: 0 40px;
				margin: 0;
				margin-top: 2px;
			}

			.app-header .menu.desktop-menu { display: none; height: 100%; }
			.app-header .menu.mobile-menu { display: block; margin: 1em; }
			.app-header .menu.mobile-menu > mwc-icon-button { color: black; }
			.app-header .desktop-menu nav { padding-right: 30px }
		
			.app-header .desktop-menu nav ul {
				margin: 0;
				height: 100%;
				padding: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: row;
			}
		
			.app-header .desktop-menu nav ul li {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 100%;
				list-style: none;
				transition: background-color .3s;
				cursor: pointer;
			}
		
			.app-header .desktop-menu nav ul li a {
				color: black;
				padding: 0 10px;
				outline: none;
				text-decoration: none;
			}
		
			.app-header .desktop-menu nav ul li:hover, .app-header nav ul li.active {
				background-color: var(--persin-dark-green);
			}
		
			.app-header .mobile-popover {
				display: block;
				position: absolute;
				width: 100%;
				right: 0;
				transition:visibility 0.3s linear, opacity 0.3s linear;
				top: 50px;
			}
		
			.mobile-popover.hidden {
				opacity: 0;
				pointer-events: none;
			}
			.mobile-popover.visible {
				opacity: 1;
			}
		
			.app-header .mobile-popover nav ul li {
				list-style: none;
				padding: .5em;
			}
		
			.app-header .mobile-popover nav ul li a {
				color: white;
				text-decoration: none;
				outline: none;
			}
		
			.app-header .mobile-popover nav ul {
				background-color: rgba(66, 187, 116, .9);
				margin: 0;
				padding: .5em;
			}

			@media(min-width: 700px){
				.app-header .menu.desktop-menu { display: flex }
				.app-header .menu.mobile-menu { display: none }
				.app-header .mobile-popover { pointer-events: none }
			}

			/* 
			Footer 
			*/
			footer {
				height: 125px;
			}

			footer.grid {
				display: flex;
				justify-content: space-around;
				flex-direction: column;
			}

			footer.grid > div {
				display: flex;
				align-items: center;
			}

			footer.grid > div.copyright, 
			footer.grid > div.copyright a {
				user-select: none;
				color: black;
				text-decoration: none;
			}

			footer.grid > div.copyright span {
				margin: 0 2px;
			}

			footer.grid > div.social-container {
				justify-content: center;
			}
				
			footer.grid a {
				margin: 0 .5em;
				fill: white;
				height: 24px;
				width: 24px;
				transition: fill .3s;
			}

			footer.grid a:hover {
				fill: #CCC;
			}

			.legal-dialog {
				--mdc-dialog-min-width: 90vw;
				position: fixed;
				margin-top: 80px;
				z-index: 999;
			}

			footer.grid .mentions { cursor: pointer; margin: 0 }

			@media (min-width: 400px){ 
				footer.grid { flex-direction: row } 
			}

			/* 
			Contact 
			*/
			.contact.grid {
				padding: 5em;
				display: flex;
				flex-wrap: wrap;
			}

			.contact.grid > div {
				display: flex;
				flex-direction: column;
				color: white;
				justify-content: center;
				font-size: 1.2em;
				flex: 1 0 5em;
			}

			.contact.grid > div a {
				text-decoration: none;
				color: white;
				transition: color .3s;
			}

			.contact.grid > div a:hover { color: #CCC }

			.contact.grid .logotype {
				display: flex;
				align-items: center;
				align-self: center;
				user-select: none;
				margin: 2.5em;
			}

			.contact.grid .logotype h4 { margin-left: 10px }

			.contact.grid mwc-textfield, 
			.contact.grid mwc-textarea,  
			.contact.grid mwc-button {
				background-color: rgba(255, 255, 255, .8);
				text-align: left;
				padding: .5em;
				border-radius: 2px;
			}
				
			.contact.grid mwc-button {
				margin-top: 1em;
				color: black;
				align-self: flex-end;
			}

			.contact.grid mwc-button[disabled] { color: grey }

			.contact.grid .contact-form {
				display: flex;
				flex-direction: column;
				margin: 2em 0;
			}

			.contact.grid .contact-form:after {
				content: 'Le mail a été envoyé avec succès !';
				opacity: 0;
				transition: opacity .3s;
				position: absolute;
				color: black;
				display: flex;
				align-self: center;
				margin-top: 100px;
			}

			.contact.grid .contact-form.sended:after {
				opacity: 1;
			}

			.contact-infos > div {
				margin: 1.5em 0;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
			}

			.contact-infos > div > mwc-icon {
				margin: 0 .2em;
			}

			mwc-textfield, mwc-textarea, mwc-button { --mdc-theme-primary: var(--persin-green);}
			mwc-dialog { overflow-y: scroll }
			</style>
			<div id="persin-app" class="app">
				<header class="app-header">
					<h1 @click="${(e: Event) => {this._onNavClick(e, {class: 'home'}, false)}}">Persin Conseil</h1>
					<div class="menu desktop-menu">
						${this._nav}
					</div>
					<div class="menu mobile-menu">
						<mwc-icon-button icon="menu" @click="${this._toggleMobilePopover}"></mwc-icon-button>
					</div>
					<div id="mobileMenu" class="mobile-popover hidden">
						${this._nav}
					</div>
				</header>
				<main @click="${this._hideMobileMenu}">
					<slot></slot>
					<section>
						<div class="parallax-wrap">
							<div id="contact" class="contact section parallax grid image-format ${this.imageFormat}">
								<div>
									<div class="logotype">
										<picture>
											<source srcset="assets/persin.webp" type="image/webp">
											<source srcset="assets/persin.jpg" type="image/jpeg"> 
											<img class="persin__logo" src="assets/persin.jpg" width="100" height="100" alt="Persin">
										</picture>
										<h4>Conseil & Services</h4>
									</div>
									<div class="contact-infos">
										<div class="phone">
											<mwc-icon>phone</mwc-icon>
											<a href="tel:0033609888386" itemprop="telephone">+33 6 09 88 83 86</a> 
										</div>
										<div>
											<mwc-icon>mail</mwc-icon>
											<a href="mailto:contact@persin.fr" itemprop="email">contact@persin.fr</a> 
										</div>
										<div>
											<mwc-icon>home</mwc-icon>
											<a target="_blank" rel="noopener" href="https://www.google.com/maps/place/38+Quai+Georges+Gorse,+92100+Boulogne-Billancourt/data=!4m2!3m1!1s0x47e67af13b2927a9:0x172eee5c2e77cf44?ved=2ahUKEwi1l_3996XfAhVKbBoKHZqIA5UQ8gEwAHoECAAQAQ">38 quai Georges Gorse, 92100 Boulogne-Billancourt</a>
										</div>
									</div>
								</div>
								<div>
									${this.isOnline ? html`
									<div class="contact-form" id="contactForm" @input=${() => {
										this._updateFields();
									}}>
										<mwc-textfield autocomplete="name" id="nom" type="text" label="Nom" name="nom" min-length="4" required></mwc-textfield>
										<mwc-textfield autocomplete="email" id="email" type="email" label="E-mail" name="email" min-length="4" required></mwc-textfield>
										<mwc-textarea id="message" type="text" label="Message" name="message" min-length="4" char-counter></mwc-textarea>
										<mwc-button disabled id="sendmail" type="submit" @click="${this._doSendEmail}" label="Envoyer"></mwc-button>
									</div>
									` : html`
									<div class="contact-form">
										Merci de nous contacter par téléphone, la connexion internet n'est pas disponible.
									</div>
									`}
							</div>
						</div>
					</div>
				</section>
				</main>
				<footer class="grid" @click="${this._hideMobileMenu}">
					<div class="social-container">
						<a rel="noopener" title="Facebook" href="https://facebook.com/PersinConseil" target="_blank">
							<svg class="social" id="facebook" aria-label="Facebook logo" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0"/></svg>
						</a>
						<a rel="noopener" title="Twitter" href="https://twitter.com/PersinConseil" target="_blank">
							<svg id="twitter" class="social" aria-label="Twitter logo" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>
						</a>
						<a rel="noopener" title="LinkedIn" href="https://fr.linkedin.com/in/thibautmatias" target="_blank">
							<svg id="linkedin" class="social" aria-label="Linkedin logo" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
						</a>
					</div>
					<div class="copyright">
						<span>&copy; 2008 - ${new Date().getFullYear()} Persin Conseil Services</span> | <span><a class="mentions" @click="${this._showLegal}">Mentions Légales</a></span>
					</div>
				</footer>
			</div>

			<mwc-dialog hide-actions heading="Mentions légales" id="legal" class="legal-dialog" @click="${() => {
				this._hideLegal();
			}}">
				<div>
					<p>Thibaut MATIAS</p>
					<p>Entrepreneur et chef d'entreprise</p>
					<p>Persin™ <abbr title="Entreprise unipersonnelle à responsabilité limitée">EURL</abbr>
					<br>38 quai Georges Gorse
					<br>92100 Boulogne-Billancourt
					<br>France</p>
					<p><br>Tel. : +33 6 09 88 83 86 
					<br><br>R.C.S : 504 629 551 Nanterre 
					<br>SIRET : 504 629 551 00012 
					<br>APE : 9511Z 
					<br>N° TVA Intracommunautaire : FR62504629551 <br><br>Conformément à la LOI n° 2004-801 du 6 août 2004 relative à la protection des personnes physiques à l'égard des traitements de données à caractère personnel modifiant la loi n° 78-17 du 6 janvier 1978, ce site a été déclaré auprès de la CNIL. <br>Le N° d’enregistrement CNIL est le 662531. <br>Nous vous rappelons qu’en notre qualité, nous sommes assujetties au secret professionnel dans les conditions prévues aux articles 226-13 et 226-14 du code pénal, pour tout ce qui concerne la divulgation de ces éléments d'identification personnelle ou de toute information permettant d'identifier la personne concernée. Ce secret professionnel n'est pas opposable à l'autorité judiciaire. <br>Hébergeur : OVH | 2 rue Kellermann | 59100 Roubaix | France | Tel: 08 203 203 63 n° indigo (0.118 €/min) <br>Web : <a title="avec-WWW" href="http://www.persin.fr">http://www.persin.fr</a> | <a title="sans-WWW" href="http://persin.fr">http://persin.fr</a> <br>Référencement du site fait par : <a title="SEO" href="http://www.persin.fr">http://www.persin.fr</a> <br>Les droits d'auteurs de ce site sont enregistrés devant notaire. Toute reproduction sera poursuivi devant les tribunaux.</p>
				</div>
			</mwc-dialog>
		`;
	}

	private _onResize(_event: Event){
		this._hideMobileMenu();
	}

	private _onOnlineStatusChange(event: Event){
		if(event.type === 'offline'){
			this.isOnline = false;
		} else {
			this.isOnline = true;
		}
	}

	private _scrollTo(element: HTMLElement) {
		element.scrollIntoView({behavior: 'smooth'});
	}

	private _onNavClick(e: Event, link: {class: string}, fromBurger: boolean): void {
		e.preventDefault();
		
		this.currentSection = link.class;

		let section = this.querySelector(`#${link.class}`) as HTMLDivElement;
		if(!section){
			section = this.shadowRoot.querySelector(`#${link.class}`) as HTMLDivElement;
		}
		this._scrollTo(section);

		if(fromBurger){
			this._toggleMobilePopover();
		} else {
			this._hideMobileMenu();
		}
	}

	private _showLegal(): void {
		this.legal.show();
	}

	private _hideLegal(): void {
		this.legal.close();
	}

	private _updateFields(){
		let isValid = true;
		// Check each
		const inputs = this._inputs();

		for(const input of inputs){
			if(input.value && input.value.length > 0 && input.reportValidity() === false){
				isValid = false;
				break;
			}
		}

		if(isValid){
			this.sendmail.disabled = false;
		} else {
			this.sendmail.disabled = true;
		}

		return isValid;
	}

	@query('#nom')
	private _name: TextField
	@query('#email')
	private _email: TextField
	@query('#message')
	private _message: TextField
	@query('#contactForm')
	private _form: TextField

	private _inputs(){
		return [this._name, this._email, this._message];
	}

	private _doSendEmail(event: Event): void {
		const button = event.target as Button;

		// Grab fields
		const isValid = this._updateFields();
		const inputs = this._inputs();

		if(isValid){
			// disable everyone
			button.disabled = true;
			inputs.forEach((input) => input.disabled = true);

			const formData = new FormData();

			for(const field of inputs){
				formData.append(field.id, field.value);
			}

			// @tool: uncomment to disable mail sending
			// if(location.hostname.indexOf('localhost') !== -1) { form.classList.add('sended'); return; }

			// Send through Gmail
			const xhr = new XMLHttpRequest();
			xhr.open('POST', 'https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbzmQXkAZxnqeXv4eA7ib1QlgikrTXr-0BmupizQjowFYMIibvI/exec');
			xhr.onreadystatechange = () => {
				if (xhr.status === 200) {
					this._form.classList.add('sended');
				}
			};
			xhr.send(formData);
		}
	}

	private _toggleMobilePopover(){
		if(window.innerWidth > 700){
			this.mobileMenu.classList.add('hidden');
			this.mobileMenu.classList.remove('visible');
			return;
		}

		if(this.mobileMenu.classList.contains('hidden')){
			this.mobileMenu.classList.remove('hidden');
			this.mobileMenu.classList.add('visible');
		} else {
			this.mobileMenu.classList.add('hidden');
			this.mobileMenu.classList.remove('visible');
		}
	}

	private _hideMobileMenu(){
		this.mobileMenu.classList.remove('visible');
		this.mobileMenu.classList.add('hidden');
	}
}