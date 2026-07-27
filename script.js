fetch('data.json')
  .then(response => response.json())
  .then(items => {
    const container = document.getElementById('items');
    items.forEach(item => {
      container.innerHTML += `
        <div class="card">
          <img src="${item.image}" alt="${item.title}">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      `;
    });
  });
