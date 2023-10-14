const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'path-to-your-stylesheet.css';

document.head.appendChild(link);

(async function init() {
    const response = await fetch('http://localhost:3000/get-profile');
    console.log("response", response);
    const user = await response.json();
    console.log(JSON.stringify(user));

    document.getElementById('name').textContent = user.name ? user.name : 'Olivia Wilson';
    document.getElementById('email').textContent = user.email ? user.email : 'olivia.wilson@example.com';
    document.getElementById('interests').textContent = user.interests ? user.interests : 'Kayaking';

    const cont = document.getElementById('container');
    cont.style.display = 'border-box';
})();

async function handleUpdateProfileRequest() {
    const contEdit = document.getElementById('container-edit');
    const cont = document.getElementById('container');

    const payload = {
        name: document.getElementById('input-name').value, 
        email: document.getElementById('input-email').value, 
        interests: document.getElementById('input-interests').value
    };
    
    const response = await fetch('http://localhost:3000/update-profile', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const jsonResponse = await response.json();

    

    document.getElementById('name').textContent = jsonResponse.name;
    document.getElementById('email').textContent = jsonResponse.email;
    document.getElementById('interests').textContent = jsonResponse.interests;

    cont.style.display = 'block';
    contEdit.style.display = 'none';
}

function updateProfile() {
    const contEdit = document.getElementById('container-edit');
    const cont = document.getElementById('container');

    document.getElementById('input-name').value = document.getElementById('name').textContent;
    document.getElementById('input-email').value = document.getElementById('email').textContent;
    document.getElementById('input-interests').value = document.getElementById('interests').textContent;

    cont.style.display = 'none';
    contEdit.style.display = 'border-box';
}

