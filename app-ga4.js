const contact = 'https://wa.me/258870777666';
function trackWhatsApp(serviceName, contactPoint) {
 window.gtag('event', 'whatsapp_click', {
   send_to: 'G-GQ581GVFDG',
   service_name: serviceName,
   contact_point: contactPoint
 });
}

document.addEventListener('click', event => {
 const link = event.target.closest('a[data-whatsapp-service]');
 if (link) trackWhatsApp(link.dataset.whatsappService, link.dataset.contactPoint || 'rodape');
});
document.addEventListener('auxclick', event => {
 if (event.button !== 1) return;
 const link = event.target.closest('a[data-whatsapp-service]');
 if (link) trackWhatsApp(link.dataset.whatsappService, link.dataset.contactPoint || 'rodape');
});

const services = [
 ['formacao','Aulas de informática ao domicílio','Aprenda ao seu ritmo, com exercícios práticos e acompanhamento individual.','M2 4h20v13H2z M7 21h10m-5-4v4'],
 ['digital','Criação de websites','Sites institucionais, portfólios e páginas para divulgar o seu negócio.','M3 4h18v16H3z M3 8h18 M8 13l-2 2 2 2m8-4 2 2-2 2'],
 ['digital','E-mails corporativos','Criação e configuração de e-mails com o domínio da sua empresa.','M2 5h20v14H2z M2 6l10 8L22 6'],
 ['digital','Gestão de redes sociais','Planeamento de conteúdos, design de publicações e gestão de páginas.','M3 4h18v13H9l-5 4v-4H3z M7 9h10m-10 4h6'],
 ['digital','Sistemas de gestão','Desenvolvimento de sistemas para vendas, stock, clientes e outras rotinas da empresa.','M3 3h8v8H3z M13 3h8v8h-8z M3 13h8v8H3z M13 13h8v8h-8z'],
 ['infra','Redes de computadores','Instalação, configuração e manutenção de redes por cabo e Wi-Fi.','M9 3h6v5H9z M3 16h6v5H3z M15 16h6v5h-6z M12 8v4m-6 4v-4h12v4'],
 ['infra','Reparação de computadores','Diagnóstico, reparação e manutenção de portáteis e computadores de secretária.','M3 4h18v12H3z M7 20h10m-5-4v4 M9 10h6'],
 ['infra','Instalação de Starlink','Montagem e configuração da ligação à internet para residências e empresas.','M4 4c0 8 6 14 14 14L4 4z M11 14l-3 6m-3 1h10m1-11a4 4 0 0 0-4-4m8 4a8 8 0 0 0-8-8'],
 ['infra','Câmaras de segurança (CCTV)','Instalação e configuração de sistemas de videovigilância para casas e empresas.','M3 6h13v11H3z M16 10l5-3v9l-5-3 M7 17v4H3']
];
const list = document.querySelector('#service-list');
for (const [category,title,description,path] of services) {
 const card = document.createElement('article');
 card.className = 'service';
 card.dataset.category = category;
 card.innerHTML = '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="' + path + '"/></svg></span><h3></h3><p></p><a></a>';
 card.querySelector('h3').textContent = title;
 card.querySelector('p').textContent = description;
 const link = card.querySelector('a');
 if (category === 'formacao') {
   link.href = '#aulas';
   link.textContent = 'Ver pacotes';
 } else {
   link.href = contact + '?text=' + encodeURIComponent('Olá, RIGRA! Gostaria de pedir um orçamento para: ' + title + '.');
   link.dataset.whatsappService = title;
   link.dataset.contactPoint = 'catalogo';
   link.target = '_blank';
   link.rel = 'noopener';
   link.textContent = 'Pedir orçamento';
   link.setAttribute('aria-label', 'Pedir orçamento para ' + title);
 }
 list.append(card);
}
const filters = [...document.querySelectorAll('[data-filter]')];
for (const filter of filters) filter.addEventListener('click', () => {
 for (const button of filters) button.setAttribute('aria-pressed', String(button === filter));
 for (const card of list.children) card.hidden = filter.dataset.filter !== 'todos' && card.dataset.category !== filter.dataset.filter;
});
const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
function setMenu(open) {
 menu.setAttribute('aria-expanded', String(open));
 nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
for (const link of nav.querySelectorAll('a')) link.addEventListener('click', () => setMenu(false));

const form = document.querySelector('#enrol');
const packageSelect = form.elements.pacote;
const retry = document.querySelector('#retry');
let enrolmentUrl;
retry.addEventListener('click', () => {
 if (!enrolmentUrl) return;
 trackWhatsApp('Aulas de informatica ao domicilio', 'reabrir_inscricao');
 window.open(enrolmentUrl, '_blank', 'noopener');
});
for (const link of document.querySelectorAll('[data-plan]')) link.addEventListener('click', () => {
 packageSelect.value = link.dataset.plan;
 form.elements.nome.focus({preventScroll: true});
});
form.addEventListener('submit', event => {
 event.preventDefault();
 const data = new FormData(form);
 const name = data.get('nome').trim();
 const district = data.get('bairro').trim();
 const phone = data.get('telefone').replace(/ /g,'');
 if (!name || !district || !/^(?:\+?258)?8\d{8}$/.test(phone)) {
   const field = !name ? form.elements.nome : !district ? form.elements.bairro : form.elements.telefone;
   field.setCustomValidity('Preencha este campo com um valor válido.');
   field.reportValidity();
   field.addEventListener('input', () => field.setCustomValidity(''), {once:true});
   return;
 }
 const message = [
   'Olá, RIGRA! Gostaria de me inscrever nas aulas de informática ao domicílio.',
   'Nome: ' + name,
   'Telemóvel: ' + phone,
   'Bairro: ' + district,
   'Pacote: ' + packageSelect.selectedOptions[0].textContent,
   'Horário: ' + data.get('horario'),
   data.get('notas').trim() && 'Objectivo: ' + data.get('notas').trim()
 ].filter(Boolean).join('\n');
 enrolmentUrl = contact + '?text=' + encodeURIComponent(message);
 document.querySelector('#feedback').hidden = false;
 trackWhatsApp('Aulas de informatica ao domicilio', 'inscricao');
 window.open(enrolmentUrl, '_blank', 'noopener');
});
