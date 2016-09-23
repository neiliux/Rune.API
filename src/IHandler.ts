export interface IHandler {
    get?: (req, res, next) => void;
    post?: (req, res, next) => void;
}
