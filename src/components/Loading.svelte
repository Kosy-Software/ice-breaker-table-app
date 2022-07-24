<script lang="ts">
    export var msg: string;
    export var delay: number;

    let loadingPromise = new Promise<void>((resolve, _reject) => {
        setTimeout(() => resolve(), delay);
    });
</script>

{#await loadingPromise then _waitedLongEnough}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <div class="center-content">
        <span><i class="fa fa-circle-notch fa-spin"></i> {msg}</span>
    </div>
{/await}