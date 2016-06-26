export interface IHandler {
    get?: (req, res, next) => void;
}
