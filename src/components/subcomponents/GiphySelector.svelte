<script lang="ts">
    //Wrapper for giphy grid
    import Button from "@kosy/kosy-svelte-components/Button.svelte";
    import { renderGrid, renderGif } from "@giphy/js-components";
    import { createEventDispatcher, onMount } from "svelte";
    import { giphyFetch } from "../../lib/clientStore";

    export let imageId: string;

    type ComponentState = "showingGif" | "selectingGif";
    let componentState: ComponentState = "showingGif";

    type GiphyMessage = { "giphy-selected": { id: string } };
    const dispatch = createEventDispatcher<GiphyMessage>();

    const fetcher = $giphyFetch;
    let search = "";
    let gridComponent;
    let gifComponent;

    const fetchGifs = (offset: number) => {
        if (search) {
            return fetcher.search(search, { offset, limit: 10, rating: "pg", type: "gifs" });
        }
        return fetcher.trending({ offset, limit: 10, rating: "pg", type: "gifs" });
    }

    let makeGif = async (imageId: string) => {
        const render = async (mountNode: HTMLElement) => {
            const { data: gif } = await fetcher.gif(imageId);
            return renderGif({ gif, width: 300, onGifClick: (_gif, event) => { event.preventDefault(); startSelectingGif(); } }, mountNode);
        };
        const remove = await render(document.getElementById("gif"));
        return {
            remove: () => {
                remove();
            }
        }
    }

    const makeGrid = (targetEl: HTMLElement) => {
        const render = () => renderGrid(
            {
                width: innerWidth,
                fetchGifs,
                columns: targetEl.offsetWidth < 500 ? 2 : 3,
                gutter: 6,
                onGifClick: async (gif, event) => {
                    event.preventDefault(); 
                    dispatch("giphy-selected", { id: gif.id.toString() });
                    componentState = "showingGif";  
                    remove();
                    gifComponent = await makeGif(gif.id.toString());
                }
            },
            targetEl
        );
        const resizeRender = () => throttle(500, render);
        window.addEventListener("resize", resizeRender, false);
        const remove = render();
        return {
            remove: () => {
                remove();
                window.removeEventListener("resize", resizeRender, false);
            }
        };
    };

    let throttleTimer;
	const throttle = (millis: number, fun: Function) => {
        clearTimeout(throttleTimer);
        throttleTimer = setTimeout(() => {
            fun();
        }, millis);
	};

    let debounce: svelte.JSX.FormEventHandler<HTMLInputElement> = (_e) => {};
    let debounceTimer;
    debounce = (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {                                
            search = (e.target as HTMLInputElement).value;                
            gridComponent?.remove();
            gridComponent = makeGrid(document.getElementById("grid"));
        }, 300);
    };


    let startSelectingGif = () => {
        gifComponent?.remove();
        gridComponent = makeGrid(document.getElementById("grid"));
        componentState = "selectingGif";        
    }

    onMount(async () => {
        if (imageId) {
            gifComponent = await makeGif(imageId);
        }
    });
    
</script>

<div>
    {#if componentState === "showingGif"}
        {#if !imageId}
            <Button importance="tertiary" size="small" on:click={() => startSelectingGif()}>Select a gif</Button>
        {/if}
    {:else}
        <input type="text" placeholder="Search" on:input={debounce} />
    {/if}
    <div id="grid"></div>
    <div id="gif"></div>
</div>