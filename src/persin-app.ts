import { LitElement, html, property, queryAll, query } from 'lit-element';
import { supportsWebp } from './images';

import { TextField } from '@material/mwc-textfield';
import { Dialog } from '@material/mwc-dialog';
import { Button } from '@material/mwc-button';
import styles from './persin-app-styles';

// Offline plugin for production builds
if(location.host.indexOf('localhost') === -1){
	const OfflinePluginRuntime = require('offline-plugin/runtime');
	OfflinePluginRuntime.install();
}

import '@material/mwc-icon';
import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-textarea';

class PersinApp extends LitElement {
	@property({type: String})
	private currentSection: string;

	@property({type: String})
	private imageFormat: string;

	@property({type: Object})
	private isOnline: boolean;

	@queryAll('.section')
	private sections: NodeListOf<HTMLDivElement>;

	@query('#legal')
	private legal: Dialog;

	@query('#mobileMenu')
	private mobileMenu: HTMLDivElement;

	private readonly _listenersOptions: AddEventListenerOptions = { passive: true };
	private _onSectionChange: IntersectionObserverCallback;

	constructor(){
		super();
		this._onSectionChange = this._onSectionsChange.bind(this);
		this._onOnlineStatusChange = this._onOnlineStatusChange.bind(this);
		this._onResize = this._onResize.bind(this);
	}

	public connectedCallback(){
		super.connectedCallback();

		window.addEventListener('online',  this._onOnlineStatusChange, this._listenersOptions);
		window.addEventListener('offline', this._onOnlineStatusChange, this._listenersOptions);
		window.addEventListener('resize', this._onResize, this._listenersOptions);
	}

	public disconnectedCallback(){
		super.disconnectedCallback();

		window.removeEventListener('online',  this._onOnlineStatusChange, this._listenersOptions);
		window.removeEventListener('offline', this._onOnlineStatusChange, this._listenersOptions);
		window.removeEventListener('resize', this._onResize, this._listenersOptions);
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

	async firstUpdated(){
		const supports = await supportsWebp();
		if(supports){
			this.imageFormat = 'webp';
		} else {
			this.imageFormat = 'jpg';
		}

		this.isOnline = navigator.onLine;

		const iObserverRootOpts = {
			rootMargin: '100px',
			threshold: 1.0
		};

		const iObserver = new IntersectionObserver(this._onSectionChange, iObserverRootOpts)

		for(const section of Array.from(this.sections)){
			iObserver.observe(section);
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

	public createRenderRoot(){
		return this;
	}

	public render() {
		const websiteNavigation = html`
			<nav>
				<ul>
					${this._links.map((link) => {
						return html`
						<li class="${link.class}${link.class === this.currentSection ? ' active' : ''}" @click="${() => this._onNavClick(link, true)}">
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
			<div id="persin-app" class="app">
				<header class="app-header">
					<h1 @click="${() => {this._onNavClick({class: 'home'}, false)}}">Persin Conseil</h1>
					<div class="menu desktop-menu">
						${websiteNavigation}
					</div>
					<div class="menu mobile-menu">
						<mwc-icon-button @click="${this._toggleMobilePopover}">menu</mwc-icon-button>
					</div>
					<div id="mobileMenu" class="mobile-popover hidden">
						${websiteNavigation}
					</div>
				</header>
				<section>
					<div class="parallax-wrap">
						<div id="home" class="home header section parallax ${this.imageFormat}" @click="${this._hideMobileMenu}">
							<h3>Persin Conseil</h3>
							<p>Conseil & Services</p>
						</div>
					</div>
				</section>

				<section>
					<div class="home section text-content no-background" @click="${this._hideMobileMenu}">
						<p>Le développement croissant de l'outil informatique et des possibilités exponentielles qu'il apporte est une réalité commune à chaque entreprise et particulier. Persin Conseil se démarque de toutes les sociétés de dépannage et de maintenance présentes sur le marché.</p>
						<h3>Notre valeur ajoutée ?</h3>
						<p>Fort d'un dynamisme et d'une polyvalence absolue, Persin Conseil répond à l'ensemble de vos besoins informatiques : assistance, maintenance, formation, création de sites, matériel, logiciels.</p>
						<p>Compétitive sur le plan des tarifs, Persin Conseil assure une intervention dans des délais records complétée par un programme d'assistance à distance. </p>
						<p>Nous nous préoccupons de nos clients tant sur le plan technique que sur le plan humain. Ainsi, après chaque intervention nous vous appelons afin de nous assurer de votre entière satisfaction. </p>
						<h3>Et c'est là notre seule ambition : vous satisfaire.</h3>
					</div>
				</section>

				<section>
					<div class="parallax-wrap">
						<div id="conseil" class="conseil section text-content parallax white ${this.imageFormat}" @click="${this._hideMobileMenu}">
							<h2>Conseil</h2>
							<p class="retreat start">Spécialisée en conseil et ingénierie informatique, Persin Conseil intervient au cœur du Système d'Information de ses clients.</p>
							<p class="retreat start">Notre équipe conçoit et met en œuvre des solutions personnalisées et transversales allant de la conception de l'architecture réseau à l'économie d'énergie par le choix du matériel le plus adapté, en passant par la sauvegarde des données sur site ou externalisée.</p>
							<p>Nous mobilisons nos consultants, ingénieurs et chefs de projets pour proposer une expertise technique et commerciale via la conception et la création de sites internet et la mise en œuvre d'un référencement performant afin d'offrir à nos partenaires une visibilité optimale. </p>
							<p class="start">Bénéficiez de formations personnalisées pour vos employés aux techniques bureautiques et informatiques pour un profit technique et temporel optimal. </p>
							<p>Votre activité se développe, vos besoins aussi. Nos conseils sont évolutifs et vous accompagneront tout au long de la vie de votre entreprise. N'hésitez pas à prendre contact avec notre service commercial afin d'obtenir des compléments d'informations.</p>
						</div>
					</div>
				</section>
				<section>
					<div id="installation" class="installation section text-content no-background with-picture" @click="${this._hideMobileMenu}">
						<div>
							<picture>
								<source srcset="assets/installation.webp" type="image/webp">
								<source srcset="assets/installation.jpg" type="image/jpeg"> 
								<img src="assets/installation.jpg" alt="Installation">
							</picture>
						</div>
						<div class="pad-thin">
							<h2>Installation</h2>
							<p>La base de l'informatique commence par une bonne installation de systèmes professionnels et performants à portée de main.</p> 
							<p>Bénéficiez des derniers systèmes d'exploitation du marché, mais également de logiciels de bureautique professionnelle adaptés à vos besoins. Profitez de l'installation, l'optimisation, le conseil, la formation et la sécurisation dédiée à votre activité.</p> 
							<p>À travers une veille technologique permanente et un système de maintenance bimensuelle, Persin Conseil propose à votre entreprise d'être constamment sécurisée face à toutes menaces potentielles: pannes, virus, perte de données, ralentissements réseau.</p>
						</div>
					</div>
				</section>
				<section>
					<div class="parallax-wrap">
						<div id="formation" class="formation section parallax text-content white ${this.imageFormat}" @click="${this._hideMobileMenu}">
							<h2>Formation</h2>
							<p>Chaque opérateur n'ayant ni les mêmes besoins ni un niveau similaires, nos consultants vous proposent des formations informatiques sur site adaptées à votre demande dont le contenu et la durée sont totalement flexibles. </p>
							<p>Nous offrons des formations informatiques à la carte qui s'adressent aux entrepreneurs, aux cadres et aux employés. Leur contenu et leur durée sont adaptés aux besoins de chaque acteur de l'entreprise.</p>
							<p>Notre transfert de compétences s'étend de l'initiation de l'outil informatique à l'utilisation de tous logiciels bureautique. Maîtrisez les outils graphiques en vue de la conception et de la création des vecteurs de communication de l'entreprise en développant vos sites internet. </p>
							<p class="start">Adoptez les réflexes de sécurisation de vos réseaux et de vos données aux moyens d'une initiation aux contrôles récurrents. </p>
							<p class="start">Consultez-nous sans engagement afin de définir l'offre de formation ponctuelle ou forfaitaire qui correspond le plus à vos attentes.</p>
						</div>
					</div>
				</section>
				<section>
					<div id="assistance" class="assistance section text-content no-background" @click="${this._hideMobileMenu}">
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
								<p>Sur votre lieu professionnel ou personnel notre équipe se déplace au plus près de vous. Nous vous assistons également à distance à travers un système de partage d'écran pour remédier à tout problème et à toute interrogation que vous pourriez rencontrer. </p>
								<p>Nous restons à votre disposition toute la semaine ainsi que les jours fériés pour vous guider et vous assister au quotidien. Une difficulté ou une simple question, nos conseillers répondent professionnellement et à tout instant à vos attentes.</p>
							</div>
						</div>
						<div class="full-width">
							<p>Suite à chaque intervention, nos équipes établissent votre fiche client personnelle regroupant les différentes prestations effectuées, afin de pouvoir vous répondre en parfaite connaissance de votre situation et des différentes installations dont vous bénéficiez. </p>
							<p>Nos équipes sont prêtes à vous assister en urgence et vous proposent une intervention dans les 3 heures maximum sur un simple demande de votre part. </p>
							<p>Ainsi, nous résolvons avec rapidité et efficacité, l'ensemble de vos problématiques.</p>
						</div>
					</div>
				</section>
				<section>
					<div class="parallax-wrap">
						<div id="contact" class="contact section parallax grid ${this.imageFormat}" @click="${this._hideMobileMenu}">
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
									<mwc-textfield id="nom" type="text" label="Nom" name="nom" min-length="4" required></mwc-textfield>
									<mwc-textfield id="email" type="email" label="E-mail" name="email" min-length="4" required></mwc-textfield>
									<mwc-textarea id="message" type="text" label="Message" name="message" min-length="4" char-counter></mwc-textarea>
									<mwc-button type="submit" @click="${this._doSendEmail}" label="Envoyer"></mwc-button>
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

	private _onNavClick(link: {class: string}, fromBurger: boolean): void {
		this.currentSection = link.class;

		const section = this.querySelector(`#${link.class}`) as HTMLDivElement;
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
			if(input.reportValidity() === false){
				isValid = false;
				break;
			}
		}

		return isValid;
	}

	private _inputs(){
		const name = this.querySelector('#nom') as TextField;
		const email = this.querySelector('#email') as TextField;
		const message = this.querySelector('#message') as TextField;

		return [name, email, message];
	}

	private _doSendEmail(event: Event): void {
		const button = event.target as Button;

		// Grab fields
		const form = this.querySelector('#contactForm') as HTMLDivElement;
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
					form.classList.add('sended');
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

customElements.define('persin-app', PersinApp);
