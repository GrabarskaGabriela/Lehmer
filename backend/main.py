from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from lehmer import lehmer
from von_neumann import von_neumann
from zadania.calculate_integral import calculate_integral
from zadania.lista0_zadanie9 import calculate_joint_distribution_task
from zadania.lista1_zadanie8_rozklad_poissona import generate_poisson_distribution
from zadania.lista2_zadanie4_proces_poissona import (
    generate_poisson_process,
)


class LehmerRequest(BaseModel):
    k: int = Field(100, ge=1)
    a: int = Field(101)
    x0: int = Field(3)
    n: int = Field(900, ge=1, le=100_000)


class ParametryVonNeumanna(BaseModel):
    X0: int = Field(12, alias="seed")
    m: int = Field(2, alias="digits", ge=1, le=12)
    n: int = Field(100, alias="count", ge=1, le=10_000)


class IntegralRequest(BaseModel):
    k: int = Field(1024, ge=1)
    a: int = Field(48271)
    seed: int = Field(12345)
    n: int = Field(100, ge=1, le=100_000)


class DistributionRequest(BaseModel):
    k: int = Field(1024, ge=1)
    a: int = Field(48271)
    x0: int = Field(12345)
    n: int = Field(100, ge=1, le=100_000)
    lambda_value: float = Field(2.0, alias="lambda", gt=0)


class PoissonProcessRequest(BaseModel):
    k: int = Field(1024, ge=1)
    a: int = Field(48271)
    x0: int = Field(12345)
    max_time: float = Field(10.0, alias="maxTime", gt=0)
    lambda_value: float = Field(2.0, alias="lambda", gt=0)


app = FastAPI(title="Lehmer Web API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/lehmer")
def algorytm_lehmera(request: LehmerRequest) -> dict:
    return lehmer(request.k, request.a, request.x0, request.n)


@app.post("/api/von-neumann")
def algorytm_von_neumanna(parametry: ParametryVonNeumanna) -> dict:
    kroki = von_neumann(
        parametry.X0,
        parametry.m,
        parametry.n,
    )
    return {"steps": kroki}


@app.post("/api/integral")
def integral(request: IntegralRequest) -> dict:
    return calculate_integral(request.k, request.a, request.seed, request.n)


@app.post("/api/poisson")
def poisson(request: DistributionRequest) -> dict:
    return generate_poisson_distribution(
        request.k,
        request.a,
        request.x0,
        request.n,
        request.lambda_value,
    )


@app.post("/api/poisson-process")
def poisson_process(request: PoissonProcessRequest) -> dict:
    return generate_poisson_process(
        request.k,
        request.a,
        request.x0,
        request.max_time,
        request.lambda_value,
    )


@app.get("/api/lista0/zadanie9")
def lista0_zadanie9() -> dict:
    return calculate_joint_distribution_task()
