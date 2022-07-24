<script lang="ts">
    import { v4 as uuidv4 } from "uuid";
    import { createEventDispatcher } from "svelte";
    import { clearCache, fetchQuestionPack } from "../lib/clientStore";
    import type { CreatingQuestionPack, EditingQuestionPack } from "../lib/appState";
    import type { ClientEvent } from "../lib/clientEvents";
    import { IQuestionPack, QuestionPack } from "../lib/questionPack";
    import { saveQuestionPack as saveQuestionPackToTemporaryStore } from '../lib/temporaryStore';
    import ButtonGroup from './subcomponents/ButtonGroup.svelte';
    import Button from '@kosy/kosy-svelte-components/Button.svelte';
    import { EditorQuestion, EditorQuestionPack } from "../lib/editorQuestionPack";

    //app state
    export let state: CreatingQuestionPack | EditingQuestionPack;

    //component state
    type ComponentEditor =
        | QuestionPackEditor
        | QuestionEditor

    type QuestionPackEditor = {
        type: "questionPackEditor"
    }

    type QuestionEditor = {
        type: "questionEditor",
        question: EditorQuestion,
        index: number
    }

    let componentEditor: ComponentEditor = { type: "questionPackEditor" };

    let isSaving: boolean = false;
    type EditQuestionPackEvent = { message: ClientEvent };
    let dispatch = createEventDispatcher<EditQuestionPackEvent>();

    let internalQuestionPack: EditorQuestionPack;

    const createQuestionPackPromise = async () => {
        let questionPack: IQuestionPack = await (state.type === "creatingQuestionPack" ? Promise.resolve(null) : fetchQuestionPack(state));
        internalQuestionPack = new EditorQuestionPack(questionPack ?? new QuestionPack());
        return internalQuestionPack;
    }

    let questionPackPromise = createQuestionPackPromise();

    const saveQuestionPack = async () => {
        let toSave = internalQuestionPack.toQuestionPack();
        isSaving = true;

        //Save to temporary store (TODO: use actual database :))
        await saveQuestionPackToTemporaryStore(toSave);

        //Question packs are cached by default -> clear cache to make sure the new question pack is used
        clearCache();

        isSaving = false;

        switch (state.type) {
            case "creatingQuestionPack": dispatch("message", { type: "questionPackCreated", questionPack: toSave });
            case "editingQuestionPack": dispatch("message", { type: "questionPackEdited", questionPack: toSave });
        }
    }

    const cancelEditQuestionPack = () => {
        dispatch("message", { type: "questionPackEditCancelled" });
    }

    const editQuestion = (question: EditorQuestion, index: number) => {
        componentEditor = { type: "questionEditor", question: { ...question }, index };
    }

    const createQuestion = () => {
        componentEditor = { type: "questionEditor", question: { id: uuidv4(), question: { text: "", imageId: "" } }, index: internalQuestionPack.questions.length };
    }

    const saveQuestion = () => {
        var questionEditor = componentEditor as QuestionEditor;
        internalQuestionPack.questions[questionEditor.index] = questionEditor.question;
        componentEditor = { type: "questionPackEditor" };
    }

    const cancelEditQuestion = () => {
        componentEditor = { type: "questionPackEditor" };
    }
</script>

{#await questionPackPromise then _promiseResolved}
    {#if componentEditor.type == "questionPackEditor"}
        <!-- Question pack editor -->
        <fieldset disabled={isSaving}>
            <div>
                <label for="name">Name</label>
                <input id="name" type="text" bind:value={internalQuestionPack.name} />
            </div>

            <div>
                <label for="description">Icon</label>
                <input id="description" type="text" bind:value={internalQuestionPack.icon} />
            </div>

            <div>
                <label for="questions">Questions</label>
                <ul id="questions">
                    {#each internalQuestionPack.questions as question, index (question.id)}
                        <li>
                            <input type="text" value={question.question.text} />
                            <Button size="small" importance="tertiary" on:click={() => editQuestion(question, index)}>EDIT QUESTION (TODO: style me)</Button>
                        </li>
                    {/each}
                    {#if internalQuestionPack.questions.length < 50}
                        <li><Button size="small" importance="tertiary" on:click={() => createQuestion()} >ADD QUESTION (TODO: style me)</Button></li>
                    {:else}
                        <li><Button size="small" importance="tertiary" disabled={true}>MAXIMUM QUESTIONS REACHED (TODO: style me)</Button></li>
                    {/if}
                </ul>
            </div>

            <ButtonGroup>
                <Button size="small" importance="primary" on:click={() => saveQuestionPack()}>Save</Button>
                <Button size="small" importance="secondary" on:click={() => cancelEditQuestionPack()}>Cancel</Button>
            </ButtonGroup>
        </fieldset>
    {:else if componentEditor.type == "questionEditor"}
        <!-- Question editor -->
        <div>
            <label for="text">Question</label>
            <input id="text" type="text" bind:value={componentEditor.question.question.text} />
        </div>

        <div>
            <label for="imageId">Image</label>
            <input id="imageId" type="text" value="TODO." />
        </div>

        <ButtonGroup>
            <Button size="small" importance="primary" on:click={() => saveQuestion()}>Save</Button>
            <Button size="small" importance="secondary" on:click={() => cancelEditQuestion()}>Cancel</Button>
        </ButtonGroup>
    {/if}
{/await}