from contextlib import asynccontextmanager
from typing import Annotated, Optional

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select


# Define our models
class WishlistItemBase(SQLModel):
    name: str = Field(index=True)
    description: Optional[str] = None
    url: Optional[str] = None
    downloaded: Optional[bool] = True
    category: Optional[str] = None  # Added category field


class WishlistItem(WishlistItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class WishlistItemPublic(WishlistItemBase):
    id: int


class WishlistItemCreate(WishlistItemBase):
    pass


class WishlistItemUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    downloaded: Optional[bool] = None
    category: Optional[str] = None


# Database setup
sqlite_file_name = "wishlist.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()  # Your startup code
    yield
    # Optional shutdown code here


app = FastAPI(lifespan=lifespan, title="Wishlist API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/wishlist/", response_model=WishlistItemPublic)
def create_item(item: WishlistItemCreate, session: SessionDep):
    db_item = WishlistItem.model_validate(item)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@app.get("/wishlist/", response_model=list[WishlistItemPublic])
def read_items(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    items = session.exec(select(WishlistItem).offset(offset).limit(limit)).all()
    return items


@app.get("/wishlist/search/", response_model=list[WishlistItemPublic])
def search_items(
    # Parameter without default comes first:
    session: SessionDep,
    # Parameters with defaults follow:
    query: Optional[str] = None,
    category: Optional[str] = None,
    downloaded: Optional[bool] = None,
):
    statement = select(WishlistItem)

    if query:
        statement = statement.where(WishlistItem.name.contains(query))

    if category:
        statement = statement.where(WishlistItem.category == category)

    if downloaded is not None:
        statement = statement.where(WishlistItem.downloaded == downloaded)

    items = session.exec(statement).all()
    return items


@app.get("/wishlist/{item_id}", response_model=WishlistItemPublic)
def read_item(item_id: int, session: SessionDep):
    item = session.get(WishlistItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.patch("/wishlist/{item_id}", response_model=WishlistItemPublic)
def update_item(item_id: int, item: WishlistItemUpdate, session: SessionDep):
    db_item = session.get(WishlistItem, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    item_data = item.model_dump(exclude_unset=True)
    db_item.sqlmodel_update(item_data)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@app.delete("/wishlist/{item_id}")
def delete_item(item_id: int, session: SessionDep):
    item = session.get(WishlistItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    session.delete(item)
    session.commit()
    return {"message": "Item deleted successfully"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
