namespace InventoryItemsManager.Api.Common;

/// <summary>
/// Represents the result of an operation with unified error handling.
/// Follows functional programming principles for explicit error handling.
/// </summary>
public abstract record Result
{
    public sealed record Success : Result;
    public sealed record ValidationFailure(Dictionary<string, string[]> Errors) : Result;
    public sealed record ConflictFailure(string Message) : Result;
    public sealed record NotFoundFailure(string Message) : Result;
    public sealed record UnexpectedFailure(string Message) : Result;
}

/// <summary>
/// Represents the result of an operation that returns a value.
/// </summary>
public abstract record Result<T>
{
    public sealed record Success(T Value) : Result<T>;
    public sealed record ValidationFailure(Dictionary<string, string[]> Errors) : Result<T>;
    public sealed record ConflictFailure(string Message) : Result<T>;
    public sealed record NotFoundFailure(string Message) : Result<T>;
    public sealed record UnexpectedFailure(string Message) : Result<T>;

    /// <summary>
    /// Executes a delegate based on the result type.
    /// </summary>
    public TResult Match<TResult>(
        Func<T, TResult> onSuccess,
        Func<Dictionary<string, string[]>, TResult> onValidationFailure,
        Func<string, TResult> onConflictFailure,
        Func<string, TResult> onNotFoundFailure,
        Func<string, TResult> onUnexpectedFailure) =>
        this switch
        {
            Success success => onSuccess(success.Value),
            ValidationFailure vf => onValidationFailure(vf.Errors),
            ConflictFailure cf => onConflictFailure(cf.Message),
            NotFoundFailure nf => onNotFoundFailure(nf.Message),
            UnexpectedFailure uf => onUnexpectedFailure(uf.Message),
            _ => throw new InvalidOperationException("Unknown result type")
        };

    public TResult Match<TResult>(
        Func<T, TResult> onSuccess,
        Func<Result<T>, TResult> onFailure) =>
        this switch
        {
            Success success => onSuccess(success.Value),
            _ => onFailure(this as Result<T> ?? throw new InvalidOperationException())
        };
}
