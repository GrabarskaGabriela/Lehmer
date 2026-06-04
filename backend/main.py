from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from lehmer import calculate_lehmer
from von_neumann import calculate_von_neumann
from zadania.calculate_integral import calculate_integral
from zadania.task_lista0_zadanie9 import calculate_joint_distribution_task
from zadania.task_lista1_zadanie8_poisson import generate_poisson_distribution
from zadania.task_lista2_zadanie2_inverse_cdf import (
    generate_exponential_inverse_distribution,
)


class LehmerRequest(BaseModel):
    k: int = Field(100, ge=1)
    a: int = Field(101)
    x0: int = Field(3)
    n: int = Field(900, ge=1, le=100_000)


class VonNeumannRequest(BaseModel):
    seed: int = Field(12)
    digits: int = Field(2, ge=1, le=12)
    count: int = Field(100, ge=1, le=10_000)


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
def lehmer(request: LehmerRequest) -> dict:
    return calculate_lehmer(request.k, request.a, request.x0, request.n)


@app.post("/api/von-neumann")
def von_neumann(request: VonNeumannRequest) -> dict:
    steps = calculate_von_neumann(request.seed, request.digits, request.count)
    return {"steps": steps}


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


@app.post("/api/inverse-cdf/exponential")
def inverse_cdf_exponential(request: DistributionRequest) -> dict:
    return generate_exponential_inverse_distribution(
        request.k,
        request.a,
        request.x0,
        request.n,
        request.lambda_value,
    )


@app.get("/api/lista0/zadanie9")
def lista0_zadanie9() -> dict:
    return calculate_joint_distribution_task()
