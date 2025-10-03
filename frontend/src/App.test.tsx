import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { describe, it, expect ,vi} from "vitest";



import App from "./App";
import store from "./redux/stroe";


// mock child components to simplify test
vi.mock("./pages/HomePage", () => ({
  default: () => <div>Mock Home Page</div>,
}));
vi.mock("./pages/LoginPage", () => ({
  default: () => <div>Mock Login Page</div>,
}));

describe("App Routing", () => {
  it("renders HomePage at root path", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/mock home page/i)).toBeInTheDocument();
  });

  it("renders LoginPage at /login", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/mock login page/i)).toBeInTheDocument();
  });
});
