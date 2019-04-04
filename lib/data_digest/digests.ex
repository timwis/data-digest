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

  alias DataDigest.Digests.Subscriber

  @doc """
  Returns the list of subscribers.

  ## Examples

      iex> list_subscribers()
      [%Subscriber{}, ...]

  """
  def list_subscribers do
    Repo.all(Subscriber)
  end

  @doc """
  Gets a single subscriber.

  Raises `Ecto.NoResultsError` if the Subscriber does not exist.

  ## Examples

      iex> get_subscriber!(123)
      %Subscriber{}

      iex> get_subscriber!(456)
      ** (Ecto.NoResultsError)

  """
  def get_subscriber!(id), do: Repo.get!(Subscriber, id)

  @doc """
  Creates a subscriber.

  ## Examples

      iex> create_subscriber(%{field: value})
      {:ok, %Subscriber{}}

      iex> create_subscriber(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_subscriber(attrs \\ %{}) do
    %Subscriber{}
    |> Subscriber.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a subscriber.

  ## Examples

      iex> update_subscriber(subscriber, %{field: new_value})
      {:ok, %Subscriber{}}

      iex> update_subscriber(subscriber, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_subscriber(%Subscriber{} = subscriber, attrs) do
    subscriber
    |> Subscriber.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Subscriber.

  ## Examples

      iex> delete_subscriber(subscriber)
      {:ok, %Subscriber{}}

      iex> delete_subscriber(subscriber)
      {:error, %Ecto.Changeset{}}

  """
  def delete_subscriber(%Subscriber{} = subscriber) do
    Repo.delete(subscriber)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking subscriber changes.

  ## Examples

      iex> change_subscriber(subscriber)
      %Ecto.Changeset{source: %Subscriber{}}

  """
  def change_subscriber(%Subscriber{} = subscriber) do
    Subscriber.changeset(subscriber, %{})
  end
end