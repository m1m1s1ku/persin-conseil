import { LitElement, html, property } from '@polymer/lit-element';
import styles from './persin-app-styles';

import { PaperButtonElement } from '@polymer/paper-button/paper-button';
import { PaperDialogElement } from '@polymer/paper-dialog/paper-dialog';
import { PaperInputElement } from '@polymer/paper-input/paper-input';
import { PaperTextareaElement } from '@polymer/paper-input/paper-textarea';

import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-iconset-svg/iron-iconset-svg';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dialog/paper-dialog';
import { supportsWebp } from './images';

// Offline plugin for production builds
if(location.host.indexOf('localhost') === -1){
	const OfflinePluginRuntime = require('offline-plugin/runtime');
	OfflinePluginRuntime.install();
} 

class PersinApp extends LitElement {
	@property({type: String})
	private currentSection: string;

	@property({type: String})
	private imageFormat: string;

	@property({type: Object})
	private isOnline: boolean;

	constructor(){
		super();
		this._onOnlineStatusChange = this._onOnlineStatusChange.bind(this);
	}

	connectedCallback(){
		super.connectedCallback();
		supportsWebp().then((supports) => {
			if(supports) this.imageFormat = 'webp';
		});
		this.isOnline = navigator.onLine;
		window.addEventListener('online',  this._onOnlineStatusChange);
		window.addEventListener('offline', this._onOnlineStatusChange);
	}

	disconnectedCallback(){
		window.removeEventListener('online',  this._onOnlineStatusChange);
		window.removeEventListener('offline', this._onOnlineStatusChange);
	}

	public render() {
		const links = [
			{ class: 'home', content: html`<iron-icon icon="home"></iron-icon>`},
			{ class: 'conseil', content: 'Conseil' },
			{ class: 'installation', content: 'Installation' },
			{ class: 'formation', content: 'Formation' },
			{ class: 'assistance', content: 'Assistance' },
			{ class: 'contact', content: 'Contact' }
		];

		const websiteNavigation = html`
			<nav>
				<ul>
					${links.map((link) => {
						return html`
						<li class="${link.class}${link.class === this.currentSection ? ' active' : ''}" @click="${() => this._onNavClick(link)}">
							<a href="#${link.class}">
								${link.content}
							</a>
						</li>`;
					})}
				</ul>
			</nav>
		`;

		return html`
			<style>
				${styles}
			</style>
			<div class="app">
				<header class="app-header">
					<h1 @click="${() => {this._onNavClick({class: 'home'})}}">Persin Conseil</h1>
					<div class="menu desktop-menu">
						${websiteNavigation}
					</div>
					<div class="menu mobile-menu">
						<iron-icon icon='menu' @click="${this._toggleMobilePopover}"></iron-icon>
					</div>
					<div id="mobileMenu" class="mobile-popover" style="visibility: hidden;">
						${websiteNavigation}
					</div>
				</header>

				<div id="home" class="home header section parallax ${this.imageFormat}" @mouseover="${this._onScroll}">
					<h3>Persin Conseil</h3>
					<p>Conseil & Services</p>
				</div>

				<div class="home section text-content no-background" @mouseover="${this._onScroll}">
					<p>Le développement croissant de l'outil informatique et des possibilités exponentielles qu'il apporte est une réalité commune à chaque entreprises et particuliers. Persin Conseil se démarque de toutes les sociétés de dépannage et de maintenance présentes sur le marché.</p>
					<h3>Notre valeur ajoutée ?</h3>
					<p>Fort d'un dynamisme et d'une polyvalence absolue, Persin Conseil répond à l'ensemble de vos besoins informatique : assistance, maintenance, formation, création de sites, matériel, logiciels.</p>
					<p>Compétitive sur le plan des tarifs, Persin Conseil assure une intervention dans des délais records complétée par un programme d'assistance à distance. </p>
					<p>Nous nous occupons de nos clients tant sur le plan technique que sur le plan humain. Ainsi, après chaque intervention nous vous appelons afin de nous assurer de votre entière satisfaction. </p>
					<h3>Et c'est là notre seule ambition : vous satisfaire.</h3>
				</div>

				<div id="conseil" class="conseil section text-content parallax white ${this.imageFormat}" @mouseover="${this._onScroll}">
					<h2>Conseil</h2>
					<p class="retreat start">Spécialisée en conseil et ingénierie informatique, Persin Conseil intervient au cœur du Système d'Information de ses clients.</p>
					<p class="retreat start">Notre équipe conçoit et met en œuvre des solutions personnalisées et transversales allant de la conception de l'architecture réseau à l'économie d'énergie par le choix du matériel le plus adapté, en passant par la sauvegarde des données sur site ou externalisée.</p>
					<p>Nous mobilisons nos consultants, ingénieurs et chefs de projets pour proposer une expertise technique et commerciale via la conception et la création de sites internet et la mise en œuvre d'un référencement performant afin d'offrir à nos partenaires une visibilité optimale. </p>
					<p class="start">Bénéficiez de formations personnalisées pour vos employés aux techniques bureautiques et informatiques pour un profit technique et temporel optimal. </p>
					<p>Votre activité se développe, vos besoins aussi. Nos conseils sont évolutifs et vous accompagneront tout au long de la vie de votre entreprise. N'hésitez pas à prendre contact avec notre service commercial afin d'obtenir des compléments d'informations.</p>
				</div>
				<div id="installation" class="installation section text-content no-background with-picture" @mouseover="${this._onScroll}">
					<div>
						<picture>
							<source srcset="assets/installation.webp" type="image/webp">
							<source srcset="assets/installation.jpg" type="image/jpeg"> 
							<img src="assets/installation.jpg" alt="Installation">
						</picture>
					</div>
					<div>
						<h2>Installation</h2>
						<p>La base de l'informatique commence par une bonne installation de systèmes professionnels et performant à porté de main.</p> 
						<p>Bénéficiez des derniers systèmes d'exploitation du marché, mais également de logiciels de bureautique professionnelle adaptés à vos besoins. Profitez de l'installation, l'optimisation, le conseil, la formation et la sécurisation dédié à votre activité.</p> 
						<p>A travers une veille technologique permanente et un système de maintenance bimensuelle, Persin Conseil propose à votre entreprise d'être constamment sécurisé face à toutes menaces potentielles: pannes, virus, perte de données, ralentissements réseau.</p>
					</div>
				</div>
				<div id="formation" class="formation section parallax text-content white ${this.imageFormat}" @mouseover="${this._onScroll}">
					<h2>Formation</h2>
					<p>Chaque opérateur n'ayant pas des besoins et un niveau similaire, nos consultants vous proposent des formations informatiques sur site adaptés à votre demande dont le contenu et la durée sont totalement flexible. </p>
					<p>Nous offrons des formations informatique à la carte qui s'adressent aux entrepreneurs, aux cadres et aux employés. Leur contenu et leur durée sont adaptés aux besoins de chaque acteur de l'entreprise.</p>
					<p>Notre transfert de compétence s'étend de l'initiation de l'outil informatique à l'utilisation de tous logiciels bureautique. Maîtrisez les outils graphiques en vue de la conception et de la création des vecteurs de communication de l'entreprise en développant vos sites internet. </p>
					<p class="start">Adoptez les réflexes de sécurisation de vos réseaux et de vos données aux moyens d'une initiation aux contrôles récurrents. </p>
					<p class="start">Consultez nous sans engagement afin de définir l'offre de formation ponctuelle ou forfaitaire qui correspond le plus à vos attentes.</p>
				</div>
				<div id="assistance" class="assistance section text-content no-background" @mouseover="${this._onScroll}">
					<div class="with-picture">
						<div>
							<picture>
								<source srcset="assets/assistance.webp" type="image/webp">
								<source srcset="assets/assistance.jpg" type="image/jpeg"> 
								<img src="assets/assistance.jpg" alt="Assistance">
							</picture>
						</div>
						<div class="full-width">
							<h2>Assistance</h2>
							<p>Nos prestataires vous offrent une disponibilité totale sur site 7j/7 et se déplacent gratuitement.</p>
							<p>Sur votre lieu professionnel ou personnel notre équipe se déplace au plus près de vous. Nous vous assistons également à distance à travers un système de partage d'écran pour remédier à tous problème et à toute interrogation que vous pourriez rencontrer. </p>
							<p>Nous restons à votre disposition toute la semaine ainsi que les jours fériés pour vous guider et vous assister au quotidien. Une difficulté ou une simple question, nos conseillers répondent professionnellement et à tout instant à vos attentes.</p>
						</div>
					</div>
					<div class="full-width">
						<p>Suite à chaque intervention, nos équipes établissent votre fiche client personnelle regroupant les différentes prestations effectuées, afin de pouvoir vous répondre en parfaite connaissance de votre situation et des différentes installation dont vous bénéficiez. </p>
						<p>Nos équipes sont prêtes à vous assister en urgence et vous proposent une intervention dans les 3 heures maximum sur un simple de votre part. </p>
						<p>Ainsi, nous résolvons avec rapidité et efficacité, l'ensemble de vos problématiques.</p>
					</div>
				</div>
				<div id="contact" class="contact section parallax grid ${this.imageFormat}" @mouseover="${this._onScroll}">
					<div>
						<div class="logotype">
							<picture>
								<source srcset="assets/persin.webp" type="image/webp">
								<source srcset="assets/persin.jpg" type="image/jpeg"> 
								<img class="persin__logo" src="assets/persin.jpg" alt="Persin">
							</picture>
							<h4>Conseil & Services</h4>
						</div>
						<div class="contact_infos">
							<div class="phone">
								<iron-icon icon="perm-phone-msg"></iron-icon>
								<a href="tel:0033609888386" itemprop="telephone">+33 6 09 88 83 86</a> 
							</div>
							<div>
								<iron-icon icon="mail"></iron-icon>
								<a href="mailto:contact@persin.fr" itemprop="email">contact@persin.fr</a> 
							</div>
							<div>
								<iron-icon icon="home"></iron-icon>
								<a target="_blank" rel="external" href="https://www.google.com/maps/place/38+Quai+Georges+Gorse,+92100+Boulogne-Billancourt/data=!4m2!3m1!1s0x47e67af13b2927a9:0x172eee5c2e77cf44?ved=2ahUKEwi1l_3996XfAhVKbBoKHZqIA5UQ8gEwAHoECAAQAQ">38 quai Georges Gorse, 92100 Boulogne-Billancourt</a>
							</div>
						</div>
					</div>
					<div>
						${this.isOnline ? html`
						<div class="contact-form" id="contactForm">
							<paper-input id="nom" type="text" label="Nom" name="nom" min-length="4" required></paper-input>
							<paper-input id="email" type="email" label="E-mail" name="email" min-length="4" required></paper-input>
							<paper-textarea id="message" type="text" label="Message" name="message" min-length="4" char-counter required></paper-textarea>
							<paper-button type="submit" @click="${this._doSendEmail}">Envoyer</paper-button>
						</div>
						` : html`
						<div class="contact-form">
							Merci de nous contacter par téléphone, la connexion internet n'est pas disponible.
						</div>
						`}

					</div>
				</div>
				<footer class="grid">
					<div class="social-container">
						<iron-iconset-svg name="inline" size="24">
							<svg id="facebook" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0"/></svg>
							<svg id="linkedin" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
							<svg id="twitter" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>
						</iron-iconset-svg>
						<a rel="external" href="https://facebook.com/PersinConseil" target="_blank">
							<iron-icon class="social" icon="inline:facebook" role="img" aria-label="Facebook"></iron-icon>
						</a>
						<a rel="external" href="https://twitter.com/PersinConseil" target="_blank">
							<iron-icon class="social" icon="inline:linkedin" role="img" aria-label="Linkedin"></iron-icon>
						</a>
						<a rel="external" href="https://fr.linkedin.com/in/thibautmatias" target="_blank">
							<iron-icon class="social" icon="inline:twitter" role="img" aria-label="Twitter"></iron-icon>
						</a>
					</div>
					<div class="copyright">
						<span>&copy; 2008 - ${new Date().getFullYear()} Persin Conseil Services</span> | <span><a class="mentions" @click="${this._showLegal}">Mentions Légales</a></span>
					</div>
				</footer>
			</div>

			<paper-dialog id="legal" with-backdrop>
				<h2>Mentions légales</h2>
				<p>
					Thibaut MATIAS 
					<br>Entrepreneur et chef d'entreprise 
					<br>Persin™ <abbr title="Entreprise unipersonnelle à responsabilité limitée">EURL</abbr> 
					<br>38 quai Georges Gorse 
					<br>92100 Boulogne-Billancourt 
					<br>France 
					<br><br>Tel. : +33 6 09 88 83 86 
					<br><br>R.C.S : 504 629 551 Nanterre 
					<br>SIRET : 504 629 551 00012 
					<br>APE : 9511Z 
					<br>N° TVA Intracommunautaire : FR62504629551 <br><br>Conformément à la LOI n° 2004-801 du 6 août 2004 relative à la protection des personnes physiques à l'égard des traitements de données à caractère personnel modifiant la loi n° 78-17 du 6 janvier 1978, ce site a été déclaré auprès de la CNIL. <br>Le N° d’enregistrement CNIL est le 662531. <br>Nous vous rappelons qu’en notre qualité, nous sommes assujetties au secret professionnel dans les conditions prévues aux articles 226-13 et 226-14 du code pénal, pour tout ce qui concerne la divulgation de ces éléments d'identification personnelle ou de toute information permettant d'identifier la personne concernée. Ce secret professionnel n'est pas opposable à l'autorité judiciaire. <br>Hébergeur : OVH | 2 rue Kellermann | 59100 Roubaix | France | Tel: 08 203 203 63 n° indigo (0.118 €/min) <br>Web : <a href="http://www.persin.fr">http://www.persin.fr</a> | <a href="http://persin.fr">http://persin.fr</a> <br>Référencement du site fait par : <a href="http://www.persin.fr">http://www.persin.fr</a> <br>Les droits d'auteurs de ce site sont enregistrés devant notaire. Toute reproduction sera poursuivi devant les tribunaux.
				</p>
			</paper-dialog>
		`;
	}

	private _onOnlineStatusChange(event: Event){
		if(event.type === 'offline'){
			this.isOnline = false;
		} else {
			this.isOnline = true;
		}
	}

	private _onNavClick(link: {class: string}): void {
		this.currentSection = link.class;
		window.location.hash = link.class;

		this.shadowRoot.querySelector(`#${link.class}`).scrollIntoView({ 
			behavior: 'smooth' 
		});
	}

	private _showLegal(): void {
		const legalDialog = this.shadowRoot.querySelector('#legal') as PaperDialogElement;
		legalDialog.opened = true;
	}

	private _doSendEmail(event: Event): void {
		// Grab fields
		const form = this.shadowRoot.querySelector('#contactForm') as HTMLDivElement;
		const button = event.target as PaperButtonElement;
		const name = this.shadowRoot.querySelector('#nom') as PaperInputElement;
		const email = this.shadowRoot.querySelector('#email') as PaperInputElement;
		const message = this.shadowRoot.querySelector('#message') as PaperTextareaElement;
		
		let isValid = true;

		const check = (input: PaperInputElement) => {
			return input.validate();
		};
		// Check each
		const inputs = [name, email, message];
		inputs.forEach((input: PaperInputElement) => check(input) ? input.invalid = false : input.invalid = true);
		inputs.forEach((input) => {
			if(input.invalid && isValid){
				isValid = false;
			}
		});
		
		if(isValid){
			// disable everyone
			button.disabled = true;
			inputs.forEach((input) => input.disabled = true);

			const formData = new FormData();
			formData.append('nom', name.value);
			formData.append('email', email.value);
			formData.append('message', message.value);

			if(location.hostname.indexOf('localhost') !== -1) { form.classList.add('sended'); return; }

			// Send through Gmail
			const xhr = new XMLHttpRequest();
			xhr.open('POST', 'https://script.google.com/macros/s/AKfycbyAnH8k_6ZYV1YieeZCfk9VTCFnJ2yv_SnJWjT5cqFd5d3d4fZc/exec');
			xhr.onreadystatechange = () => {
				if (xhr.status === 200) {
					form.classList.add('sended');
				}
			};
			xhr.send(formData);

		}
	}

	private _onScroll(event: Event){
		const target = event.target as HTMLDivElement;
		if(target && target.classList 
			&& target.classList.contains('section') 
			&& target.classList[0] !== this.currentSection){ 
				this.currentSection = target.classList[0] 
		}
	}

	private _toggleMobilePopover(){
		const mobilePopover = this.shadowRoot.querySelector('#mobileMenu') as HTMLDivElement;
		if(mobilePopover.style.visibility === 'visible'){
			mobilePopover.style.visibility = 'hidden';
		} else {
			mobilePopover.style.visibility = 'visible';
		}
	}
}

customElements.define('persin-app', PersinApp);
