const GITHUB_TOKEN = prompt("Enter your GitHub Token:");
const OWNER = "UJayathilaka";
const REPO = "GXSHELPER";

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function githubPut(path, contentBase64, message) {
  let sha = null;
  const check = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    headers: { "Authorization": `token ${GITHUB_TOKEN}` }
  });
  if (check.ok) {
    const data = await check.json();
    sha = data.sha;
  }

  return fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      "Authorization": `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: message,
      content: contentBase64,
      sha: sha
    })
  });
}

async function uploadItem() {
  const status = document.getElementById('status');
  status.textContent = "Uploading...";

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const file = document.getElementById('imageFile').files[0];

  if (!title || !file) {
    status.textContent = "Title and image ඕන!";
    return;
  }

  const id = Date.now().toString();
  const imagePath = `images/${id}.webp`;

  const imageBase64 = await toBase64(file);
  await githubPut(imagePath, imageBase64, `Add image ${id}`);

  const dataRes = await fetch('data.json');
  const items = await dataRes.json();

  items.push({
    id: id,
    title: title,
    description: description,
    image: imagePath
  });

  const jsonBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(items, null, 2))));
  await githubPut('data.json', jsonBase64, `Add item ${id}`);

  status.textContent = "Done! Website update වෙන්න 1-2 minutes යනවා.";
}