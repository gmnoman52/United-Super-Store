const screens = ['home', 'browse', 'cart', 'orders', 'account'];
function showScreen(moveFocus = false) {
  const requested = location.hash.slice(1);
  const route = screens.includes(requested) ? requested : 'home';
  document.querySelectorAll('.screen').forEach(screen => {
    screen.hidden = screen.id !== `screen-${route}`;
  });
  document.querySelectorAll('.bottom-nav a').forEach(link => {
    if (link.hash === `#${route}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = `${route[0].toUpperCase() + route.slice(1)} — United Super Store`;
  if (moveFocus) {
    document.getElementById('main').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}
window.addEventListener('hashchange', () => showScreen(true));
showScreen();
document.querySelectorAll('input[name="fulfilment"]').forEach(input => {
  input.addEventListener('change', () => {
    const delivery = input.value === 'delivery';
    document.getElementById('mode-hint').textContent = delivery
      ? 'Choose your delivery address at checkout'
      : 'Collect your order from United Super Store';
    document.getElementById('cart-mode').textContent = delivery
      ? 'Shopping for delivery' : 'Shopping for store pickup';
  });
});
const search = document.getElementById('search');
const clear = document.getElementById('clear-search');
function updateSearch() {
  const searching = search.value.trim().length > 0;
  clear.hidden = !searching;
  document.getElementById('browse-empty-title').textContent = searching
    ? 'No products available yet' : 'The shelves are empty';
  document.getElementById('browse-empty-copy').textContent = searching
    ? 'There are no products in the catalogue to search yet'
    : 'Once products are added, you’ll find them here';
}
search.addEventListener('input', updateSearch);
document.getElementById('search-form').addEventListener('submit', event => {
  event.preventDefault();
  updateSearch();
});
clear.addEventListener('click', () => { search.value = ''; updateSearch(); search.focus(); });

document.getElementById('copyright-year').textContent = new Intl.DateTimeFormat('en',{year:'numeric',timeZone:'Asia/Karachi'}).format(new Date());
