function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function cursor_loop(cursor, fps)
{
    const frames = frame_cache[cursor];
    const sleep_duration = 1000 / fps;
    const buttons = document.querySelectorAll(".splatoon-theme .back-button button, .splatoon-theme .main-buttons button");

    let done = false;

    while (!done)
    {
        for (let i = 0; i < frames.length; i++)
        {
            const url = frames[i].src;
            const cursorStyle = `url("${url}") 16 16, auto`;

            document.documentElement.style.cursor = cursorStyle;

            buttons.forEach(button => {
                button.style.cursor = cursorStyle;
            });

            await sleep(sleep_duration);
        }
    }
}

async function cursor_up(ennemy, size_x, size_y, start_x, start_y, title_box_points, fps, speed, state)
{
    const frames = frame_cache[ennemy];
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
            img.src = frames[i].src;
            current_y -= speed;
            img.style.top = `${current_y}px`;

            await sleep(sleep_duration);

            if (current_y <= -size_y) break;
        }
    }

    img.remove();
    state.current_cursors--;
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

    var cursor = "cursor_octoling";
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

function get_text_box(text, class_name)
{
    const span = document.createElement("span");
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.className = class_name;
    span.innerText = text;

    document.body.appendChild(span);
    const box = span.getBoundingClientRect();
    document.body.removeChild(span);

    return{
        width: box.width,
        height: box.height
    };
}

function preload_frames(path, count)
{
    const images = [];
    const promises = [];

    for (let i = 1; i <= count; i++)
    {
        const img = new Image();
        const src = path.replace("{}", i);
        img.src = src;

        const promise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
        });

        promises.push(promise);
        images.push(img);
    }

    return Promise.all(promises).then(() => images);
}

async function start_preload_frames()
{
  frame_cache["octoling"] = await preload_frames("https://raw.githubusercontent.com/784c/_784c/refs/heads/main/data/assets/cursors/octoling/___{}.png", 17);
  frame_cache["squid"] = await preload_frames("https://raw.githubusercontent.com/784c/_784c/refs/heads/main/data/assets/cursors/squid/___{}.png", 17);
  frame_cache["cursor_octoling"] = await preload_frames("https://raw.githubusercontent.com/784c/_784c/refs/heads/main/data/assets/cursors/octoling/_{}.png", 17);
  frame_cache["cursor_squid"] = await preload_frames("https://raw.githubusercontent.com/784c/_784c/refs/heads/main/data/assets/cursors/squid/_{}.png", 17);
}

const frame_cache = {};

window.onload = async function ()
{
    await start_preload_frames();

    background_loop();

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