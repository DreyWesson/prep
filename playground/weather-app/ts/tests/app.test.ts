import { screen, fireEvent, waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { ui } from "../src/main";
interface IElement{
    input : HTMLInputElement;
    btn : HTMLButtonElement

}
describe('WEATHER', () => {
    let input : HTMLInputElement;
    let btn : HTMLButtonElement;

    function expectElementsToBeInTheDocument(input: HTMLInputElement, btn: HTMLButtonElement) {
        expect(input).toBeInTheDocument();
        expect(btn).toBeInTheDocument();
      }

    beforeEach(() => {
        document.body.innerHTML = `<div id="app">${ui}</div>`;
        const app :HTMLElement = document.querySelector("#app")!;
        input = screen.getByPlaceholderText("Enter city name");
        btn = screen.getByTestId("search-btn");
    })
    it("should have input and btn", () => {
        expectElementsToBeInTheDocument(input, btn);
    })
    it("should change input value and click button", () => {
        expectElementsToBeInTheDocument(input, btn);
        fireEvent.change(input, {target: {value: "Lagos"}} )
        expect(input.value).toBe("Lagos");
        fireEvent.click(btn);
    })
 })