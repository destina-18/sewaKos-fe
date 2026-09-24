"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ENDPOINTS,
  MONTHS,
  SHORT_MONTHS,
} from "./config";

import {
  fetchAPI,
} from "./api";

import {
  getArray,
  getMonthIndex,
  isLunas,
  toNumber,
} from "./helper";

import type {
  ChartItem,
  MonthlyReport,
  Payment,
} from "./types";

import ReportHeader from "./ReportHeader";
import ReportStats from "./ReportStats";
import RevenueChart from "./RevenueChart";
import ReportSummary from "./ReportSummary";
import MonthlyRevenue from "./MonthlyRevenue";

export default function AdminReportsPage() {
  const now = new Date();

  const currentYear =
    now.getFullYear();

  const currentMonth =
    now.getMonth();

  const [
    payments,
    setPayments,
  ] = useState<Payment[]>([]);

  const [
    monthlyReports,
    setMonthlyReports,
  ] = useState<MonthlyReport[]>([]);

  const [
    activeTenantCount,
    setActiveTenantCount,
  ] = useState(0);

  const [
    emptyRoomCount,
    setEmptyRoomCount,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * LOAD REPORT
   */

  const loadReports =
    useCallback(
      async (
        initial = false
      ) => {
        if (initial) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        try {
          setError("");

          const [
            paymentsResponse,
            monthlyResponse,
            activeResponse,
            emptyResponse,
          ] =
            await Promise.all([
              fetchAPI(
                ENDPOINTS.payments
              ),

              fetchAPI(
                ENDPOINTS.monthlyReport
              ).catch(
                (error) => {
                  console.warn(
                    "Monthly report tidak tersedia:",
                    error
                  );

                  return [];
                }
              ),

              fetchAPI(
                ENDPOINTS.activeTenants
              ).catch(
                (error) => {
                  console.warn(
                    "Active tenants tidak tersedia:",
                    error
                  );

                  return [];
                }
              ),

              fetchAPI(
                ENDPOINTS.emptyRooms
              ).catch(
                (error) => {
                  console.warn(
                    "Empty rooms tidak tersedia:",
                    error
                  );

                  return [];
                }
              ),
            ]);

          /*
           * PAYMENTS
           */

          const paymentData =
            getArray(
              paymentsResponse
            ) as Payment[];

          setPayments(
            paymentData
          );

        

          const monthlyData =
            getArray(
              monthlyResponse
            ) as MonthlyReport[];

          setMonthlyReports(
            monthlyData
          );

         

          const activeData =
            getArray(
              activeResponse
            );

          setActiveTenantCount(
            activeData.length
          );

          
          const emptyData =
            getArray(
              emptyResponse
            );

          setEmptyRoomCount(
            emptyData.length
          );
        } catch (err) {
          console.error(
            "Gagal mengambil laporan:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data laporan."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  

  useEffect(() => {
    void loadReports(true);

    const interval =
      setInterval(() => {
        if (!document.hidden) {
          void loadReports(
            false
          );
        }
      }, 5000);

    return () =>
      clearInterval(interval);
  }, [loadReports]);

  
  const chartData =
    useMemo<ChartItem[]>(
      () => {
        const revenueByMonth =
          Array(12).fill(
            0
          ) as number[];

        payments.forEach(
          (payment) => {
            

            if (
              !isLunas(
                payment
              )
            ) {
              return;
            }

            

            const monthValue =
              payment.month;

            const monthIndex =
              getMonthIndex(
                monthValue
              );

            if (
              monthIndex < 0 ||
              monthIndex > 11
            ) {
              return;
            }

            

            if (
              monthValue &&
              /^\d{4}-\d{1,2}$/.test(
                String(
                  monthValue
                )
              )
            ) {
              const paymentYear =
                Number(
                  String(
                    monthValue
                  ).split("-")[0]
                );

              if (
                paymentYear !==
                currentYear
              ) {
                return;
              }
            }

            
            revenueByMonth[
              monthIndex
            ] += toNumber(
              payment.amount
            );
          }
        );

        return MONTHS.map(
          (_, index) => ({
            month:
              SHORT_MONTHS[
                index
              ],

            revenue:
              revenueByMonth[
                index
              ],
          })
        );
      },
      [
        payments,
        currentYear,
      ]
    );

  
  const totalYearRevenue =
    useMemo(() => {
      return chartData.reduce(
        (
          total,
          item
        ) =>
          total +
          item.revenue,
        0
      );
    }, [chartData]);

 
  const currentMonthRevenue =
    chartData[
      currentMonth
    ]?.revenue || 0;

  

  const averageOccupancy =
    useMemo(() => {
      const occupancyValues =
        monthlyReports
          .map(
            (item) =>
              toNumber(
                item.occupancy ??
                  item.occupancyRate ??
                  item.averageOccupancy ??
                  item.rataRataOkupansi
              )
          )
          .filter(
            (value) =>
              value > 0
          );

     
      if (
        occupancyValues.length >
        0
      ) {
        return Math.round(
          occupancyValues.reduce(
            (
              total,
              value
            ) =>
              total + value,
            0
          ) /
            occupancyValues.length
        );
      }

      
      const totalRooms =
        activeTenantCount +
        emptyRoomCount;

      if (
        totalRooms === 0
      ) {
        return 0;
      }

      return Math.round(
        (activeTenantCount /
          totalRooms) *
          100
      );
    }, [
      monthlyReports,
      activeTenantCount,
      emptyRoomCount,
    ]);

 

  const handleLogout =
    () => {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/sign-in";
    };

 

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f3]">
        <header className="flex h-[60px] items-center justify-between border-b border-[#eeeeee] bg-white px-5 md:px-8">
          <p className="text-[12px] font-medium text-[#777]">
            Laporan
          </p>

          <div className="h-7 w-20 animate-pulse rounded-md bg-[#eeeeee]" />
        </header>

        <main className="mx-auto max-w-[1100px] px-5 py-8 md:px-8">
          <div className="animate-pulse">
            <div className="h-6 w-32 rounded bg-[#e5e5e5]" />

            <div className="mt-2 h-3 w-72 rounded bg-[#eeeeee]" />

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                1,
                2,
                3,
                4,
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[110px] rounded-[10px] bg-white"
                  />
                )
              )}
            </div>

            <div className="mt-5 h-[420px] rounded-[10px] bg-white" />
          </div>
        </main>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <ReportHeader
        onLogout={
          handleLogout
        }
      />

      {error && (
        <div className="border-b border-[#f0d8d2] bg-[#fff8f6] px-5 py-2 text-center">
          <p className="text-[9px] text-[#a35d50]">
            {error}
          </p>
        </div>
      )}

      <main className="mx-auto w-full max-w-[1100px] px-5 py-8 md:px-8">
        

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-[20px] font-bold text-[#26334a]">
              Laporan
            </h1>

            <p className="mt-1 text-[10px] text-[#8b8b8b]">
              Catat, pantau, dan analisis pendapatan kos.
            </p>
          </div>

          {refreshing && (
            <span className="mt-1 text-[8px] text-[#999]">
              Memperbarui data...
            </span>
          )}
        </div>

        

        <ReportStats
          totalYearRevenue={
            totalYearRevenue
          }
          currentMonthRevenue={
            currentMonthRevenue
          }
          averageOccupancy={
            averageOccupancy
          }
          activeTenantCount={
            activeTenantCount
          }
          currentYear={
            currentYear
          }
          currentMonth={
            currentMonth
          }
        />
       
        <RevenueChart
          data={chartData}
          currentYear={
            currentYear
          }
        />

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ReportSummary
            totalYearRevenue={
              totalYearRevenue
            }
            currentMonthRevenue={
              currentMonthRevenue
            }
            averageOccupancy={
              averageOccupancy
            }
            activeTenantCount={
              activeTenantCount
            }
            emptyRoomCount={
              emptyRoomCount
            }
          />

          <MonthlyRevenue
            data={chartData}
            currentYear={
              currentYear
            }
            currentMonth={
              currentMonth
            }
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[7px] text-[#aaa]">
            Data diperbarui otomatis setiap 5 detik.
          </p>

          <button
            type="button"
            onClick={() =>
              void loadReports(
                false
              )
            }
            disabled={
              refreshing
            }
            className="rounded-md border border-[#ddd] bg-white px-3 py-1.5 text-[8px] font-medium text-[#555] transition hover:bg-[#f5f5f5] disabled:opacity-50"
          >
            {refreshing
              ? "Memuat..."
              : "Refresh"}
          </button>
        </div>
      </main>
    </div>
  );
}