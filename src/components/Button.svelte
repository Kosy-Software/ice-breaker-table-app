<script type="ts">
    type ButtonSize = "regular" | "small" | "floating"
    type ButtonImportance = "spotlight" | "primary" | "secondary" | "tertiary"

    export let size: ButtonSize;
    export let importance: ButtonImportance;

    let buttonClass = "";
    $: {
        let cssStyles = []
        if (size) {
            cssStyles.push("size-" + size);
        } else {
            cssStyles.push("size-regular");
        }
        if (importance) cssStyles.push("importance-" + importance);
        buttonClass = [ "re-button", ...cssStyles ].join(" ");
    }
</script>

<style lang="scss" global>
    @use "./../styles/_colors.scss" as colors;

    .re-button {
        text-align: center;
        border-radius: 100px;
        border: none;
        cursor: pointer;
        box-sizing: border-box;
        display: block;
        font-family: "Inter", sans-serif;
        font-weight: 500;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.size-regular {
            height: 52px;
            line-height: 44px;
            font-size: 14px;
            min-width: 52px;
            .icon-left,
            .icon-right {
                font-size: 20px;
            }
        }
        &.size-small {
            height: 40px;
            line-height: 36px;
            font-size: 12px;
            min-width: 40px;
            .icon-left,
            .icon-right {
                font-size: 16px;
            }
        }
        &.size-floating {
            height: 64px;
            line-height: 62px;
            font-size: 16px;
            min-width: 64px;
            .icon-left,
            .icon-right {
                font-size: 22px;
            }
        }
        &.importance-spotlight {
            background: white;
            border: 1px solid colors.$color-grey-border;
            span {
                color: black;
                background: linear-gradient(30.85deg, #5300f1 10.93%, #ff2539 85.6%);
                background-clip: text;
                -webkit-background-clip: text;
                -moz-background-clip: text;
                -webkit-text-fill-color: transparent;
                -moz-text-fill-color: transparent;
            }
            &:hover {
                background: colors.$color-grey-light;
            }
            &.disabled {
                background: colors.$color-grey-default;
                color: white;
            }
        }
        &.importance-primary {
            background: colors.$color-primary;
            color: white;
            &:hover {
                background: colors.$color-primary-dark;
            }
            &.disabled {
                background: colors.$color-grey-default;
            }
        }
        &.importance-secondary {
            background: white;
            border: 1px solid colors.$color-grey-border;
            color: colors.$color-grey-dark;
            &:hover {
                background: colors.$color-grey-light;
            }
            &.toggle-on {
                color: colors.$color-black-bluish;
                border-color: colors.$color-black-bluish;
            }
            &:active {
                background: colors.$color-grey-border; // good job, Robin! <3
            }
            &.disabled {
                color: colors.$color-grey-default;
                border-color: colors.$color-grey-default;
            }
        }
        &.importance-tertiary {
            background: white;
            color: colors.$color-grey-dark;
            &:hover {
                background: colors.$color-grey-light;
            }
            &.disabled {
                color: colors.$color-grey-default;
            }
        }
        .icon-left {
            padding-left: 20px;
        }
        .icon-right {
            padding-right: 20px;
        }
        .icon-left,
        .icon-right {
            vertical-align: bottom;
            &:only-child {
                padding: 0;
            }
        }
        .text {
            padding: 0 8px;
            &:first-child {
                padding-left: 20px;
            }
            &:last-child {
                padding-right: 20px;
            }
        }
    }
</style>

<button class={buttonClass} on:click on:dblclick on:focus>
    <slot></slot>
</button>