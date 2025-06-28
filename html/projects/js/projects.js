const projects = [
    "project1",
    "project2"
];

const container = document.getElementById("file-explorer");

projects.forEach(projectName =>
{
    const link = document.createElement("a");
    link.href = `data/${projectName}/index.html`;
    link.textContent = projectName;
    link.style.display = "block";

    container.appendChild(link);
});