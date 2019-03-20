defmodule DataDigest.Digests do
  @moduledoc """
  The Digests context.
  """

  import Ecto.Query, warn: false
  alias DataDigest.Repo

  alias DataDigest.Digests.Digest

  @doc """
  Returns the list of digests.

  ## Examples

      iex> list_digests()
      [%Digest{}, ...]

  """
  def list_digests do
    Repo.all(Digest)
  end

  @doc """
  Gets a single digest.

  Raises `Ecto.NoResultsError` if the Digest does not exist.

  ## Examples

      iex> get_digest!(123)
      %Digest{}

      iex> get_digest!(456)
      ** (Ecto.NoResultsError)

  """
  def get_digest!(id), do: Repo.get!(Digest, id)

  @doc """
  Creates a digest.

  ## Examples

      iex> create_digest(%{field: value})
      {:ok, %Digest{}}

      iex> create_digest(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_digest(attrs \\ %{}) do
    %Digest{}
    |> Digest.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a digest.

  ## Examples

      iex> update_digest(digest, %{field: new_value})
      {:ok, %Digest{}}

      iex> update_digest(digest, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_digest(%Digest{} = digest, attrs) do
    digest
    |> Digest.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Digest.

  ## Examples

      iex> delete_digest(digest)
      {:ok, %Digest{}}

      iex> delete_digest(digest)
      {:error, %Ecto.Changeset{}}

  """
  def delete_digest(%Digest{} = digest) do
    Repo.delete(digest)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking digest changes.

  ## Examples

      iex> change_digest(digest)
      %Ecto.Changeset{source: %Digest{}}

  """
  def change_digest(%Digest{} = digest) do
    Digest.changeset(digest, %{})
  end
end
