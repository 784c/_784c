function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function cursor_loop(cursor, fps)
{
    const frames = [
        `../data/assets/cursors/${cursor}/_1.png`,
        `../data/assets/cursors/${cursor}/_2.png`,
        `../data/assets/cursors/${cursor}/_3.png`,
        `../data/assets/cursors/${cursor}/_4.png`,
        `../data/assets/cursors/${cursor}/_5.png`,
        `../data/assets/cursors/${cursor}/_6.png`,
        `../data/assets/cursors/${cursor}/_7.png`,
        `../data/assets/cursors/${cursor}/_8.png`,
        `../data/assets/cursors/${cursor}/_9.png`,
        `../data/assets/cursors/${cursor}/_10.png`,
        `../data/assets/cursors/${cursor}/_11.png`,
        `../data/assets/cursors/${cursor}/_12.png`,
        `../data/assets/cursors/${cursor}/_13.png`,
        `../data/assets/cursors/${cursor}/_14.png`,
        `../data/assets/cursors/${cursor}/_15.png`,
        `../data/assets/cursors/${cursor}/_16.png`,
        `../data/assets/cursors/${cursor}/_17.png`
    ];

    const sleep_duration = 1000 / fps;
    const buttons = document.querySelectorAll(".splatoon-theme .back-button button, .splatoon-theme .main-buttons button");
    var done = false;

    while (!done)
    {
        for (let i = 0; i < frames.length; i++)
        {
            const cursorStyle = `url("${frames[i]}") 16 16, auto`;

            document.documentElement.style.cursor = cursorStyle;

            buttons.forEach(button =>
            {
                button.style.cursor = cursorStyle;
            });

            await sleep(sleep_duration);
        }
    }
}

async function cursor_up(ennemy, size_x, size_y, start_x, start_y, title_box_points, fps, speed, state)
{
    const frames = [
        `../data/assets/cursors/${ennemy}/___1.png`,
        `../data/assets/cursors/${ennemy}/___2.png`,
        `../data/assets/cursors/${ennemy}/___3.png`,
        `../data/assets/cursors/${ennemy}/___4.png`,
        `../data/assets/cursors/${ennemy}/___5.png`,
        `../data/assets/cursors/${ennemy}/___6.png`,
        `../data/assets/cursors/${ennemy}/___7.png`,
        `../data/assets/cursors/${ennemy}/___8.png`,
        `../data/assets/cursors/${ennemy}/___9.png`,
        `../data/assets/cursors/${ennemy}/___10.png`,
        `../data/assets/cursors/${ennemy}/___11.png`,
        `../data/assets/cursors/${ennemy}/___12.png`,
        `../data/assets/cursors/${ennemy}/___13.png`,
        `../data/assets/cursors/${ennemy}/___14.png`,
        `../data/assets/cursors/${ennemy}/___15.png`,
        `../data/assets/cursors/${ennemy}/___16.png`,
        `../data/assets/cursors/${ennemy}/___17.png`
    ];

    const sleep_duration = 1000 / fps;
    const img = document.createElement("img");

    img.style.position = "absolute";
    img.style.left = `${start_x}px`;
    img.style.top = `${start_y}px`;
    img.style.width = `${size_x}px`;
    img.style.height = `${size_y}px`;

    document.getElementById("container").appendChild(img);

    let current_y = start_y;

    while (current_y > -size_y)
    {
        for (let i = 0; i < frames.length; i++)
        {
            img.src = frames[i];
            current_y -= speed;

            /*
            if (current_y >= title_box_points.top_left.y && current_y <= title_box_points.bottom_left.y && start_x >= title_box_points.bottom_left.x && start_x <= title_box_points.bottom_right.x)
            {
                current_y = 0;
            }
            */

            img.style.top = `${current_y}px`;

            await sleep(sleep_duration);

            if (current_y <= -size_y) break;
        }
    }

    img.remove();

    state.current_cursors --;
}

async function background_loop()
{
    var screen_size_x = window.innerWidth;
    var screen_size_y = window.innerHeight;

    const title_element = document.querySelector("#title-id");
    const title_box = title_element.getBoundingClientRect();

    const title_box_points = {
        top_left:     { x: title_box.left,  y: title_box.top },
        top_right:    { x: title_box.right, y: title_box.top },
        bottom_left:  { x: title_box.left,  y: title_box.bottom },
        bottom_right: { x: title_box.right, y: title_box.bottom }
    };

    var cursor = "octoling";
    var ennemy;
    var fps = 30;

    cursor_loop(cursor, fps);

    var cursor_number = 10;

    const state =
    {
        current_cursors: 0
    };

    var unique_cursor_id = 0;

    while (true)
    {
        if (state.current_cursors < cursor_number)
        {
            let diff = cursor_number - state.current_cursors
            for (let i = 0; i < diff; i++)
            {
                let ennemy_int = Math.floor(Math.random() * 2);

                if (ennemy_int === 0)
                {
                    ennemy = "squid";
                }
                else if (ennemy_int === 1)
                {
                    ennemy = "octoling";
                }

                let size_x = Math.random() * 100;
                let size_y = size_x;

                let position_x;
                let position_y;

                let left_zone = title_box_points.top_left.x - size_x;
                let right_zone = screen_size_x - size_x - title_box_points.bottom_right.x;

                if (Math.floor(Math.random() * 2) == 0)
                {
                    position_x = Math.random() * left_zone;
                }
                else
                {
                    position_x = title_box_points.bottom_right.x + Math.random() * right_zone;
                }

                if (unique_cursor_id < cursor_number)
                {
                    position_y = Math.random() * (screen_size_y - size_y);
                }
                else
                {
                    position_y = screen_size_y + size_y;
                }

                let speed = Math.floor(Math.random() * 5) + 1;

                state.current_cursors ++;
                cursor_up(ennemy, size_x, size_y, position_x, position_y, title_box_points, fps, speed, state);

                unique_cursor_id ++;
            }
        }

        await sleep(1000);
    }
}

async function write(text, x, y)
{
    const container = document.createElement("div");
    container.className = "typewriter-effect";
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

    const text_element = document.createElement("div");
    text_element.className = "text";
    text_element.innerHTML = text;
    text_element.style.setProperty("--characters", text.length);

    container.appendChild(text_element);
    document.body.appendChild(container);

    text_element.addEventListener("animationend", () =>
    {
        container.classList.add("done");
    }, { once: true });
}

function get_text_box(text, className = "")
{
    const span = document.createElement("span");
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.className = className;
    span.innerText = text;

    document.body.appendChild(span);
    const box = span.getBoundingClientRect();
    document.body.removeChild(span);

    return {
        width: box.width,
        height: box.height
    };
}

window.onload = async function ()
{
    background_loop();

    //boxes

    let screen_size_x = window.innerWidth;
    let screen_size_y = window.innerHeight;

    const title_element = document.querySelector("#title-id");
    const title_box = title_element.getBoundingClientRect();

    const title_box_points = {
        top_left:     { x: title_box.left,  y: title_box.top },
        top_right:    { x: title_box.right, y: title_box.top },
        bottom_left:  { x: title_box.left,  y: title_box.bottom },
        bottom_right: { x: title_box.right, y: title_box.bottom }
    };

    //boxes

    let text_x;
    let text = "Welcome to my personal website!";

    let text_size = get_text_box(text, "typewriter-effect");

    let left_zone = title_box_points.top_left.x - text_size.width;
    let right_zone = screen_size_x - text_size.width - title_box_points.bottom_right.x;

    if (Math.floor(Math.random() * 2) == 0)
    {
        text_x = Math.random() * left_zone;
    }
    else
    {
        text_x = title_box_points.bottom_right.x + Math.random() * right_zone;
    }

    let text_y = Math.random() * (screen_size_y - text_size.height);

    write(text, text_x, text_y);

    await sleep(2000);

    text = 'Feel free to check out my <a href="https://github.com/784c" target="_blank">GitHub</a>.';

    text_size = get_text_box(text, "typewriter-effect");

    left_zone = title_box_points.top_left.x - text_size.width;
    right_zone = screen_size_x - text_size.width - title_box_points.bottom_right.x;

    if (Math.floor(Math.random() * 2) == 0)
    {
        text_x = Math.random() * left_zone;
    }
    else
    {
        text_x = title_box_points.bottom_right.x + Math.random() * right_zone;
    }

    text_y = Math.random() * (screen_size_y - text_size.height);

    write(text, text_x, text_y);

    await sleep(2000);

    text = 'You can also find my <a href="social.html" target="_blank">social links</a>.';

    text_size = get_text_box(text, "typewriter-effect");

    left_zone = title_box_points.top_left.x - text_size.width;
    right_zone = screen_size_x - text_size.width - title_box_points.bottom_right.x;

    if (Math.floor(Math.random() * 2) == 0)
    {
        text_x = Math.random() * left_zone;
    }
    else
    {
        text_x = title_box_points.bottom_right.x + Math.random() * right_zone;
    }

    text_y = Math.random() * (screen_size_y - text_size.height);

    write(text, text_x, text_y);

    await sleep(2000);

    text = 'And <a href="projects.html" target="_blank">here</a>, you\'ll find my research and studies.';

    text_size = get_text_box(text, "typewriter-effect");

    left_zone = title_box_points.top_left.x - text_size.width;
    right_zone = screen_size_x - text_size.width - title_box_points.bottom_right.x;

    if (Math.floor(Math.random() * 2) == 0)
    {
        text_x = Math.random() * left_zone;
    }
    else
    {
        text_x = title_box_points.bottom_right.x + Math.random() * right_zone;
    }

    text_y = Math.random() * (screen_size_y - text_size.height);

    write(text, text_x, text_y);
};